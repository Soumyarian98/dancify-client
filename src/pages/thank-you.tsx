import { OrderResponse } from "@/types/order-response";
import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { authAxios } from "@/lib/auth-axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FiMapPin } from "react-icons/fi";
import { GoTrophy } from "react-icons/go";
import { useParams } from "react-router-dom";

const ThankYou = () => {
  const params = useParams<{ orderId: string }>();
  const query = useQuery<OrderResponse>({
    enabled: Boolean(params.orderId),
    queryKey: ["order", params.orderId],
    queryFn: async () => {
      const response = await authAxios.get(`/orders/${params.orderId}`);
      return response.data;
    },
  });

  return (
    <Container>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={900} gutterBottom>
          Thank you
        </Typography>
        {query.data && (
          <>
            <Typography variant="body2">
              {format(query.data.cretedAt, "PPpp")}
            </Typography>
          </>
        )}
      </Box>

      {query.isLoading && <CircularProgress size={22} />}
      {query.data && (
        <Stack gap={2}>
          {query.data.items.map((i) => {
            return (
              <Card key={i.id}>
                <CardHeader
                  title={i.category.categoryName}
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
                        <ListItemText primary={i.category.event.eventName} />
                      </ListItem>

                      <ListItem disableGutters disablePadding>
                        <ListItemIcon sx={{ minWidth: "24px" }}>
                          <FiMapPin />
                        </ListItemIcon>
                        <ListItemText primary={i.category.event.city} />
                      </ListItem>
                      <ListItem disableGutters disablePadding>
                        <ListItemIcon sx={{ minWidth: "24px" }}>
                          <FiMapPin />
                        </ListItemIcon>
                        <ListItemText primary={`₹${i.amount}`} />
                      </ListItem>
                    </List>
                  }
                  subheaderTypographyProps={{ variant: "body2" }}
                />
              </Card>
            );
          })}
        </Stack>
      )}
    </Container>
  );
};

export default ThankYou;
