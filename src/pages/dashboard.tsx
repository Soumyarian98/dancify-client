import { Link } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardHeader,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { GrMoney } from "react-icons/gr";
import { authAxios } from "@/lib/auth-axios";

const Dashboard = () => {
  const query = useQuery({
    queryKey: ["all-events"],
    queryFn: async () => {
      const response = await authAxios.get("/dance-event/all");
      return response.data;
    },
  });

  return (
    <Container>
      {query.data?.map((e) => {
        return (
          <Card key={e.id}>
            {/** @ts-expect-error MUI is not able to detect the type */}
            <CardActionArea LinkComponent={Link} to={`/events/${e.id}`}>
              <CardHeader
                title={e.eventName}
                titleTypographyProps={{
                  variant: "body1",
                  fontWeight: 700,
                  textTransform: "capitalize",
                }}
                subheader={
                  <List dense>
                    <ListItem disableGutters disablePadding>
                      <ListItemIcon sx={{ minWidth: "24px" }}>
                        <FiMapPin />
                      </ListItemIcon>
                      <ListItemText primary={e.city} />
                    </ListItem>
                    <ListItem disableGutters disablePadding>
                      <ListItemIcon sx={{ minWidth: "24px" }}>
                        <FiCalendar />
                      </ListItemIcon>
                      <ListItemText primary={format(e.createdAt, "PPpp")} />
                    </ListItem>
                    <ListItem disableGutters disablePadding>
                      <ListItemIcon sx={{ minWidth: "24px" }}>
                        <GrMoney />
                      </ListItemIcon>
                      <ListItemText primary={"Entry starts from ₹500"} />
                    </ListItem>
                  </List>
                }
                subheaderTypographyProps={{ variant: "body2" }}
              />
            </CardActionArea>
          </Card>
        );
      })}
    </Container>
  );
};

export default Dashboard;
