import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { z } from "zod";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  CardActions,
  Container,
  Divider,
  Button,
  Grid2,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const formSchema = z.object({
  firstName: z.string().min(2).max(50).nonempty(),
  lastName: z.string().min(2).max(50).nonempty(),
  stageName: z.string().min(2).max(50).nonempty(),
  email: z.string().email().min(2).max(50).nonempty(),
  password: z.string().min(8).max(50).nonempty(),
});

const Register = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await axios.post("http://localhost:8000/auth/register", {
        name: `${values.firstName} ${values.lastName}`,
        stageName: values.stageName,
        email: values.email,
        password: values.password,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully, Please login");
      navigate("/auth/login");
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      stageName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
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
      <Card sx={{ width: { xs: "100%", md: "400px" }, mx: "auto" }}>
        <CardHeader
          title="Sign Up"
          titleTypographyProps={{ fontWeight: 900 }}
          subheader="Enter your information to create an account"
          subheaderTypographyProps={{ variant: "body2" }}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 6 }}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      fullWidth
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  )}
                />
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      fullWidth
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  )}
                />
              </Grid2>
            </Grid2>
            <Controller
              name="stageName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Stage Name"
                  fullWidth
                  margin="normal"
                  error={!!errors.stageName}
                  helperText={errors.stageName?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
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
              Register
            </LoadingButton>
          </CardActions>
          <Divider sx={{ my: 2, px: 1 }}>or</Divider>
          <CardActions>
            <Link to="/auth/login" style={{ width: "100%" }}>
              <Button fullWidth size="large" disabled={mutation.isPending}>
                Login
              </Button>
            </Link>
          </CardActions>
        </form>
      </Card>
    </Container>
  );
};

export default Register;
