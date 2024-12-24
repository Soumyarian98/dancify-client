import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Autocomplete,
  CircularProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";

import useDebounceValue from "@/hooks/use-debounced-input";
import { authAxios } from "@/lib/auth-axios";
import { SearchPlaceResponse, Place } from "@/types/search-place-response";
import { FiMapPin } from "react-icons/fi";

interface Props {
  onSelectLocation: (user: Place) => void;
}

const SearchLocationAutocomplete = ({ onSelectLocation }: Props) => {
  const [options, setOptions] = useState<readonly Place[]>([]);
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValues = useDebounceValue(inputValue, 500);

  const query = useQuery({
    enabled: Boolean(debouncedInputValues),
    queryKey: ["search-location", debouncedInputValues],
    queryFn: async () => {
      const response = await authAxios<SearchPlaceResponse>(
        `/google-maps/search-place?search-text=${debouncedInputValues}`
      );
      return response.data;
    },
  });

  useEffect(() => {
    if (query.data) {
      setOptions(query.data.places);
    }
  }, [query.data]);

  return (
    <Autocomplete
      fullWidth
      isOptionEqualToValue={(option, value) =>
        option.formattedAddress === value.formattedAddress
      }
      getOptionLabel={(option) => option.displayName.text}
      options={options}
      loading={query.isLoading}
      onChange={(_, value) => {
        if (value) {
          onSelectLocation(value);
        }
      }}
      renderOption={(props, option) => {
        return (
          <ListItem {...props}>
            <ListItemIcon>
              <FiMapPin size={18} />
            </ListItemIcon>
            <ListItemText
              primary={option.displayName.text}
              secondary={option.formattedAddress}
            />
          </ListItem>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={(e) => setInputValue(e.target.value)}
          label="Search Location"
          margin="normal"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {query.isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
    />
  );
};

export default SearchLocationAutocomplete;
