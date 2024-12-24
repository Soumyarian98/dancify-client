import { DanceEvent } from "@/types/dance-event";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
} from "@mui/material";
import { useState } from "react";

interface Props {
  categories: DanceEvent["categories"];
  onCategorySelectionChange: (value: number[]) => void;
}

const AssignCategories = ({ categories, onCategorySelectionChange }: Props) => {
  const [selectedCategories, setSelectedCatgeories] = useState(
    categories.map(() => true)
  );
  const allCategoriesSelected = selectedCategories.every((c) => c);

  return (
    <FormControl>
      <FormLabel component="legend">Assign Category</FormLabel>
      <FormGroup>
        <FormControlLabel
          label="All"
          control={
            <Checkbox
              checked={allCategoriesSelected}
              // indeterminate={selectedCategories}
              onChange={(_, checked) => {
                setSelectedCatgeories((p) => p.map(() => checked));
                if (checked) {
                  onCategorySelectionChange(categories.map((c) => c.id));
                } else {
                  onCategorySelectionChange([]);
                }
              }}
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
                    onChange={(_, checked) => {
                      const updatedCategories = [...selectedCategories];
                      updatedCategories[index] = checked;
                      setSelectedCatgeories(updatedCategories);
                      onCategorySelectionChange(
                        updatedCategories
                          .map((isSelected, index) => {
                            if (isSelected) return categories[index].id;
                            return -1;
                          })
                          .filter((id) => id !== -1)
                      );
                    }}
                  />
                }
                label={categories[index].categoryName}
              />
            );
          })}
        </Stack>
      </FormGroup>
    </FormControl>
  );
};

export default AssignCategories;
