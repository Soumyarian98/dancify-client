import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

const OngoingEvent = () => {
  const params = useParams();
  console.log(params);
  //   const query = useQuery({
  //     queryKey: ["ongoing-event", params.orderId],
  //     queryFn: async () => {
  //         const response = await authAxios.get("")
  //     },
  //   });

  return (
    <div>
      <div>
        <Typography variant="h5" fontWeight={900}>
          Dancify
        </Typography>
      </div>
      <Typography variant="h6">1v1 Hip Hop</Typography>
      <List>
        <ListItem>
          <ListItemText primary="Soumyarian" secondary="Soumya Ranjan" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Amit" secondary="Amit Soni" />
        </ListItem>
      </List>
    </div>
  );
};

export default OngoingEvent;
