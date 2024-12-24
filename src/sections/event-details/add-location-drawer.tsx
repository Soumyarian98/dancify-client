import SearchLocationAutocomplete from "@/components/search-location-autocomplete";
import { authAxios } from "@/lib/auth-axios";
import { DanceEvent } from "@/types/dance-event";
import { EventLocation } from "@/types/event-location";
import { Place } from "@/types/search-place-response";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { Box, Container, SwipeableDrawer, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import AssignCategories from "./assign-categories";
import { useState } from "react";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  eventId: number;
  categories: DanceEvent["categories"];
}

const createLocationSchema = z.object({
  venueName: z.string().min(1, "Style is required"),
  address: z.string().min(1, "Style is required"),
  latitude: z.number().nonnegative(),
  longitude: z.number().nonnegative(),
});

type CreateLocationFormValues = z.infer<typeof createLocationSchema>;

const AddLocationDrawer = ({ eventId, open, setOpen, categories }: Props) => {
  const queryClient = useQueryClient();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    categories.map((c) => c.id)
  );

  const form = useForm<CreateLocationFormValues>({
    resolver: zodResolver(createLocationSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateLocationFormValues) => {
      const response = await authAxios.post<EventLocation>("/location", {
        ...data,
        eventId,
        categoryIds: selectedCategoryIds,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["event-details", eventId.toString()],
        (prev: DanceEvent) => {
          return {
            ...prev,
            categories: prev.categories.map((c) => {
              const updatedCategory = { ...c };
              if (selectedCategoryIds.includes(c.id)) {
                updatedCategory.location = data;
              }
              return updatedCategory;
            }),
          };
        }
      );
      toast.success("Location created successfully");
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to create location");
      console.error(error);
    },
  });

  const handleOnSelectLocation = (place: Place) => {
    form.setValue("venueName", place.displayName.text);
    form.setValue("address", place.formattedAddress);
    form.setValue("latitude", place.location.latitude);
    form.setValue("longitude", place.location.longitude);
  };

  const onSubmit = (data: CreateLocationFormValues) => mutation.mutate(data);

  const formattedAddress = form.watch("address");

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Container sx={{ mt: 2, mb: 4, maxHeight: "80vh" }}>
        <Typography variant="h6" fontWeight={700}>
          Add Location
        </Typography>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <SearchLocationAutocomplete
            onSelectLocation={handleOnSelectLocation}
          />
          {formattedAddress && (
            <Typography variant="body2" mb={2}>
              {formattedAddress}
            </Typography>
          )}
          <Box mt={1}>
            <AssignCategories
              categories={categories}
              onCategorySelectionChange={setSelectedCategoryIds}
            />
          </Box>

          <LoadingButton
            loading={mutation.isPending}
            fullWidth
            sx={{ display: "block", mt: 1 }}
            type="submit"
            size="large"
            variant="contained"
            color="primary"
          >
            Create
          </LoadingButton>
        </form>
      </Container>
    </SwipeableDrawer>
  );
};

export default AddLocationDrawer;
