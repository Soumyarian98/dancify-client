import SearchUserAutocomplete from "@/components/search-user-autocomplete";
import { authAxios } from "@/lib/auth-axios";
import { DanceEvent } from "@/types/dance-event";
import { User } from "@/types/user";
import { LoadingButton } from "@mui/lab";
import {
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  title: string;
  categories: DanceEvent["categories"];
  open: boolean;
  setOpen: (val: string | undefined) => void;
  eventId: number;
}

const AddUserDrawer = ({ title, open, setOpen, categories }: Props) => {
  const [selectedCategories, setSelectedCatgeories] = useState(
    categories.map(() => true)
  );
  const [selectedUsers, setSelectedUsers] = useState<User>();

  const mutation = useMutation({
    mutationFn: async (user: User) => {
      const response = await authAxios.post(
        "/event-role",
        selectedCategories
          .map((selected, index) => {
            if (!selected) return null;
            return {
              categoryId: categories[index].id,
              userId: user.id,
              role:
                title === "Add Judge"
                  ? "judge"
                  : title === "Add Dj"
                  ? "dj"
                  : "mc",
            };
          })
          .filter(Boolean)
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("A judge is added successfully");
      setOpen(undefined);
    },
    onError: () => {
      toast.error("Failed to add judge category");
    },
  });

  const allCategoriesSelected = selectedCategories.every((c) => c);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={() => setOpen(undefined)}
      onOpen={() => setOpen("")}
    >
      <Container sx={{ mt: 2, mb: 4, maxHeight: "80vh" }}>
        <Stack gap={3}>
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>

          <SearchUserAutocomplete onSelecteUser={setSelectedUsers} />
          <FormControl>
            <FormLabel component="legend">Assign Category</FormLabel>
            <FormGroup>
              <FormControlLabel
                label="All"
                control={
                  <Checkbox
                    checked={allCategoriesSelected}
                    // indeterminate={selectedCategories}
                    onChange={(_, checked) =>
                      setSelectedCatgeories((p) => p.map(() => checked))
                    }
                  />
                }
              />
              <Stack ml={3}>
                {selectedCategories.map((c, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={c}
                          onChange={(_, checked) =>
                            setSelectedCatgeories((p) => {
                              const updated = [...p];
                              updated[index] = checked;
                              return updated;
                            })
                          }
                        />
                      }
                      label={categories[index].categoryName}
                    />
                  );
                })}
              </Stack>
            </FormGroup>
          </FormControl>
          <LoadingButton
            loading={mutation.isPending}
            fullWidth
            sx={{ display: "block", mt: 1 }}
            size="large"
            variant="contained"
            color="primary"
            onClick={() => {
              if (selectedUsers) {
                mutation.mutate(selectedUsers);
              }
            }}
          >
            Add
          </LoadingButton>
        </Stack>
      </Container>
    </SwipeableDrawer>
  );
};

export default AddUserDrawer;
