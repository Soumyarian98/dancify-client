import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";

type LoginPayload = {
  email: string;
  password: string;
};

const formSchema = z.object({
  email: z.string().email().min(2).max(50).nonempty(),
  password: z.string().min(8).max(50).nonempty(),
});

const Login = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async ({ email, password }: LoginPayload) => {
      const response = await axios.post("http://localhost:8000/auth/login", {
        email,
        password,
      });
      return response.data as { token: string };
    },
    onSuccess: (data) => {
      navigate("/");
      console.log("hello");
      localStorage.setItem("dancify-auth-token", data.token);
      toast.success("Login Successfully");
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({ email: values.email, password: values.password });
  }

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
          title="Login"
          titleTypographyProps={{ fontWeight: 900 }}
          subheader="Enter your email below to login to your account."
          subheaderTypographyProps={{ variant: "body2" }}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  placeholder="root@gmail.com"
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
                  placeholder="Enter your password"
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
              Login
            </LoadingButton>
          </CardActions>
          <Divider sx={{ my: 2, px: 1 }}>or</Divider>
          <CardActions>
            <Link to="/auth/register" style={{ width: "100%" }}>
              <Button fullWidth size="large" disabled={mutation.isPending}>
                Register
              </Button>
            </Link>
          </CardActions>
        </form>
      </Card>
    </Container>
  );
};

export default Login;
