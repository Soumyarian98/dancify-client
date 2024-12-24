import { danceStyles } from "@/data/dance-styles";
import { authAxios } from "@/lib/auth-axios";
import { DanceEvent } from "@/types/dance-event";
import { DanceEventCategory } from "@/types/dance-event-category";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  Container,
  MenuItem,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  eventId: number;
}

const createDanceCategorySchema = z.object({
  style: z.string().min(1, "Style is required"),
  gender: z.enum(["male", "female", "mixed"]),
  entryFee: z.number().nonnegative(),
  ageGroup: z.enum(["kids", "teens", "adults", "college", "any"]),
  teamSize: z.number().min(1, "Team size is required"),
  location: z.number().optional(),
  eventId: z.number().nonnegative(),
});

type DanceCategoryFormValues = z.infer<typeof createDanceCategorySchema>;

const submitCreateCategory = async (data: DanceCategoryFormValues) => {
  const categoryName = `${data.teamSize}v${data.teamSize} ${data.style} ${
    data.gender === "mixed" ? "" : ` ${data.gender}`
  }${data.ageGroup === "any" ? "" : ` ${data.ageGroup}`}`;
  const response = await authAxios.post<DanceEventCategory>("/dance-category", {
    ...data,
    categoryName,
  });
  return response.data;
};

const AddCategoryDrawer = ({ open, setOpen, eventId }: Props) => {
  const queryClient = useQueryClient();
  const { handleSubmit, control, reset } = useForm<DanceCategoryFormValues>({
    resolver: zodResolver(createDanceCategorySchema),
    defaultValues: {
      style: "",
      gender: "mixed",
      ageGroup: "any",
      teamSize: 1,
      eventId: eventId,
    },
  });

  useEffect(() => {
    reset();
  }, [open, reset]);

  const mutation = useMutation({
    mutationFn: submitCreateCategory,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["event-details", eventId.toString()],
        (prev: DanceEvent) => {
          return {
            ...prev,
            categories: [...prev.categories, data],
          };
        }
      );
      toast.success("Dance category created successfully");
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to create dance category");
      console.error(error);
    },
  });

  const onSubmit = (data: DanceCategoryFormValues) => {
    mutation.mutate(data);
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Container sx={{ mt: 2, mb: 4, maxHeight: "80vh" }}>
        <Typography variant="h6" fontWeight={700}>
          Add Category
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="style"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                size="small"
                {...field}
                label="Style"
                fullWidth
                select
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                {danceStyles.map((d) => (
                  <MenuItem dense key={d.id} value={d.value}>
                    {d.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                label="Gender"
                select
                fullWidth
                margin="normal"
              >
                <MenuItem dense value="male">
                  Male
                </MenuItem>
                <MenuItem dense value="female">
                  Female
                </MenuItem>
                <MenuItem dense value="mixed">
                  Mixed
                </MenuItem>
              </TextField>
            )}
          />

          <Controller
            name="ageGroup"
            control={control}
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                label="Age Group"
                select
                fullWidth
                margin="normal"
              >
                <MenuItem dense value="any">
                  Any
                </MenuItem>
                <MenuItem dense value="kids">
                  Kids (1-15)
                </MenuItem>
                <MenuItem dense value="teens">
                  Teens (16-19)
                </MenuItem>
                <MenuItem dense value="adults">
                  Adults (Above 18)
                </MenuItem>
                <MenuItem dense value="college">
                  College
                </MenuItem>
              </TextField>
            )}
          />

          <Controller
            name="entryFee"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                size="small"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                label="Entry Fee"
                type="numeric"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="teamSize"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                size="small"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                label="Team Size"
                type="number"
                fullWidth
                placeholder="7"
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

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
            {/* <Typography
                variant="body2"
                textTransform="capitalize"
                fontWeight={700}
              >
                1v1 Popping Mixed Adults
              </Typography> */}
          </LoadingButton>
        </form>
      </Container>
    </SwipeableDrawer>
  );
};

export default AddCategoryDrawer;
