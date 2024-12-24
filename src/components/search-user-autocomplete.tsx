import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";

import useDebounceValue from "@/hooks/use-debounced-input";
import { authAxios } from "@/lib/auth-axios";
import { User } from "@/types/user";

interface Props {
  onSelecteUser: (user: User) => void;
}

const SearchUserAutocomplete = ({ onSelecteUser }: Props) => {
  const [options, setOptions] = useState<readonly User[]>([]);
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValues = useDebounceValue(inputValue, 500);

  const query = useQuery({
    enabled: Boolean(debouncedInputValues),
    queryKey: ["search-user", debouncedInputValues],
    queryFn: async () => {
      const response = await authAxios(
        `/users/search?email=${debouncedInputValues}`
      );
      return response.data;
    },
  });

  useEffect(() => {
    if (query.data) {
      setOptions(query.data);
    }
  }, [query.data]);

  return (
    <Autocomplete
      fullWidth
      isOptionEqualToValue={(option, value) => option.email === value.email}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={query.isLoading}
      onChange={(_, value) => {
        if (value) {
          onSelecteUser(value);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={(e) => setInputValue(e.target.value)}
          label="Search User"
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

export default SearchUserAutocomplete;
