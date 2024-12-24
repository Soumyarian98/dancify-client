import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  CardActions,
  Container,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AddressFromZipcodeResponse } from "@/types/address-from-zipcode-response";
import { authAxios } from "@/lib/auth-axios";

const formSchema = z
  .object({
    eventName: z.string().min(1, "Event name is required"),
    startTime: z
      .date({
        invalid_type_error: "Start time must be a valid date",
        required_error: "Start time is required",
      })
      .refine((date) => {
        if (!date) return true;
        return date > new Date();
      }),
    endTime: z.date({
      invalid_type_error: "End date must be a valid date",
      required_error: "End date is required",
    }),
    zipcode: z.string().min(1, "City is required"),
    posterUrl: z.string().url().optional(),
  })
  .refine((data) => data.endTime >= data.startTime, {
    message: "End date must be greater than start date",
    path: ["endTime"],
  });
type FormSchema = z.infer<typeof formSchema>;

const CreateEvent = () => {
  const mutation = useMutation({
    mutationFn: async (values: FormSchema) => {
      const response = await authAxios.post("/dance-event/create", {
        eventName: values.eventName,
        startTime: values.startTime.toISOString(),
        endTime: values.endTime.toISOString(),
        city: values.zipcode,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Event created successfully");
    },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: FormSchema) => {
    const zipcodeResult = await authAxios.get<AddressFromZipcodeResponse>(
      `http://localhost:8000/google-maps/address-from-zip?zipcode=${values.zipcode}`
    );
    if (zipcodeResult.data.status === "ZERO_RESULTS") {
      toast.error("Invalid Zipcode");
      return;
    }
    mutation.mutate({
      ...values,
      zipcode: zipcodeResult.data.results[0].formatted_address,
    });
  };

  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Card sx={{ width: { xs: "100%", md: "400px" }, mx: "auto" }}>
          <CardHeader
            title="Create Event"
            titleTypographyProps={{ fontWeight: 900 }}
          />
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <Controller
                name="eventName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Event Name"
                    margin="normal"
                    fullWidth
                    error={!!errors.eventName}
                    helperText={errors.eventName?.message}
                  />
                )}
              />
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    disablePast
                    slotProps={{
                      textField: {
                        label: "Start Date",
                        margin: "normal",
                        fullWidth: true,
                        error: !!errors.startTime,
                        helperText: errors.startTime?.message,
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    disablePast
                    slotProps={{
                      textField: {
                        label: "End Date",
                        margin: "normal",
                        fullWidth: true,
                        error: !!errors.endTime,
                        helperText: errors.endTime?.message,
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="zipcode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Zipcode"
                    margin="normal"
                    fullWidth
                    error={!!errors.zipcode}
                    helperText={errors.zipcode?.message}
                  />
                )}
              />
            </CardContent>
            <CardActions>
              <LoadingButton
                loading={mutation.isPending}
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={mutation.isPending}
              >
                Create Event
              </LoadingButton>
            </CardActions>
          </form>
        </Card>
      </LocalizationProvider>
    </Container>
  );
};

export default CreateEvent;
