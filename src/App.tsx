import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { AxiosError } from "axios";

import "@fontsource/mulish/400.css";
import "@fontsource/mulish/500.css";
import "@fontsource/mulish/600.css";
import "@fontsource/mulish/700.css";
import "@fontsource/mulish/800.css";
import "@fontsource/mulish/900.css";

import "./App.css";
// import Dashboard from "@/pages/dashboard";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Events from "@/pages/events";
import CreateEvent from "@/pages/events/create-event";
import EventDetails from "./pages/events/[id]";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Dashboard from "./pages/dashboard";
import BattleCart from "./pages/battle-cart";
import ThankYou from "./pages/thank-you";
import OngoingEvent from "./pages/events/ongoing-event";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        if (error instanceof AxiosError) {
          console.log(error);
          if (error.response) {
            // if (error.response.data.message instanceof Array) {
            //   console.log(error.response.data);
            // } else
            if (typeof error.response.data.message === "string") {
              toast.error(
                error.response.data?.message ?? "Something went wrong"
              );
            }
          }
          if (error.request) {
            toast.error(error.request.message ?? "Network request failed");
          }
        }
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider
      theme={createTheme({
        shape: {},
        palette: { mode: "dark" },
        typography: { fontFamily: "Mulish" },
      })}
    >
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="battle-cart" element={<BattleCart />} />
            <Route path="ongoing-event/:eventId" element={<OngoingEvent />} />
            <Route path="thank-you/:orderId" element={<ThankYou />} />
            <Route path="auth">
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            <Route path="events">
              <Route index element={<Events />} />
              <Route path="create-event" element={<CreateEvent />} />
              <Route path=":id" element={<EventDetails />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
