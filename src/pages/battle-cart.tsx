import { authAxios } from "@/lib/auth-axios";
import { BattleCartResponse } from "@/types/battle-cart-response";
import { CreateOrderResponse } from "@/types/create-order-response";
import { RazorpayPaymentSuccessResponse } from "@/types/razorpay-payment-success-response";
import { LoadingButton } from "@mui/lab";
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FiMapPin, FiTrash } from "react-icons/fi";
import { GoTrophy } from "react-icons/go";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useNavigate } from "react-router-dom";

const BattleCart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLoading, Razorpay } = useRazorpay();

  const query = useQuery<BattleCartResponse>({
    queryKey: ["battle-cart"],
    queryFn: async () => {
      const response = await authAxios.get("/battle-cart");
      return response.data;
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await authAxios.delete(`/battle-cart?id=${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Battle cart item deleted.");
      queryClient.setQueryData(["battle-cart"], (p: BattleCartResponse) =>
        p.filter((i) => i.id !== data.id)
      );
    },
  });

  const createOrderMutation = useMutation<CreateOrderResponse>({
    mutationFn: async () => {
      const response = await authAxios.post(
        `/orders/create`,
        query.data?.map((d) => ({
          id: d.category.id,
          price: d.category.entryFee,
        }))
      );
      return response.data;
    },
    onSuccess: (data) => {
      const options: RazorpayOrderOptions = {
        key: import.meta.env.VITE_RAZORPYA_KEY_ID, // Replace with your Razorpay key_id
        amount: data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Dancify",
        description: "Test Transaction",
        order_id: data.id,
        handler: (value) => {
          paymentSuccessMutation.mutate({ order: data, paymentInfo: value });
        },
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          // contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    },
  });

  const paymentSuccessMutation = useMutation({
    mutationFn: async (payload: {
      order: CreateOrderResponse;
      paymentInfo: RazorpayPaymentSuccessResponse;
    }) => {
      const response = await authAxios.post(`/orders/create-payment`, {
        categories: query.data?.map((d) => ({
          id: d.category.id,
          price: d.category.entryFee,
        })),
        paymentInfo: {
          razorpayOrderId: payload.paymentInfo.razorpay_order_id,
          razorpayPaymentId: payload.paymentInfo.razorpay_payment_id,
          razorpaySignature: payload.paymentInfo.razorpay_signature,
        },
        orderId: payload.order.id,
      });
      return response.data;
    },
    onSuccess: (data: { orderId: number }) => {
      toast.success("Payment successful");
      navigate(`/thank-you/${data.orderId}`);
    },
  });

  return (
    <Container>
      <Typography variant="h5" fontWeight={900} mb={3}>
        Battle Cart
      </Typography>
      {query.isLoading && (
        <Stack mt={1}>
          <CircularProgress />
        </Stack>
      )}
      {query.data && (
        <>
          {query.data.length === 0 ? (
            <Card>
              <CardContent>
                <Typography textAlign="center" fontWeight={700}>
                  😞 You battle cart feels empty
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <div>
              <Stack gap={2}>
                {query.data.map((d) => {
                  return (
                    <Card key={d.id}>
                      <CardHeader
                        title={d.category.categoryName}
                        titleTypographyProps={{
                          variant: "body1",
                          fontWeight: 700,
                          textTransform: "capitalize",
                        }}
                        subheader={
                          <List dense>
                            <ListItem disableGutters disablePadding>
                              <ListItemIcon sx={{ minWidth: "24px" }}>
                                <GoTrophy />
                              </ListItemIcon>
                              <ListItemText primary={d.event.eventName} />
                            </ListItem>

                            <ListItem disableGutters disablePadding>
                              <ListItemIcon sx={{ minWidth: "24px" }}>
                                <FiMapPin />
                              </ListItemIcon>
                              <ListItemText primary={d.event.city} />
                            </ListItem>
                            <ListItem disableGutters disablePadding>
                              <ListItemIcon sx={{ minWidth: "24px" }}>
                                <FiMapPin />
                              </ListItemIcon>
                              <ListItemText
                                primary={`₹${d.category.entryFee}`}
                              />
                            </ListItem>
                          </List>
                        }
                        subheaderTypographyProps={{ variant: "body2" }}
                        action={
                          <IconButton
                            size="small"
                            color="error"
                            disabled={deleteItemMutation.isPending}
                            onClick={() => deleteItemMutation.mutate(d.id)}
                          >
                            {deleteItemMutation.isPending ? (
                              <CircularProgress size={20} />
                            ) : (
                              <FiTrash />
                            )}
                          </IconButton>
                        }
                      />
                    </Card>
                  );
                })}
              </Stack>
              <LoadingButton
                loading={
                  isLoading ||
                  createOrderMutation.isPending ||
                  paymentSuccessMutation.isPending
                }
                fullWidth
                variant="contained"
                sx={{ mt: 3, position: "sticky", bottom: "16px", zIndex: 10 }}
                onClick={() => createOrderMutation.mutate()}
              >
                Checkout
              </LoadingButton>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default BattleCart;
