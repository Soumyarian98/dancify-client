import BattleCartIcon from "@/components/battle-cart-icon";
import useBattleCart from "@/hooks/use-battle-cart";
import { authAxios } from "@/lib/auth-axios";
import AddCategoryDrawer from "@/sections/event-details/add-category-drawer";
import AddLocationDrawer from "@/sections/event-details/add-location-drawer";
import AddUserDrawer from "@/sections/event-details/add-user-drawer";
import AssignRoleDropdown from "@/sections/event-details/assign-role-dropdown";
import EventCategoryCard from "@/sections/event-details/event-category-card";
import { DanceEvent } from "@/types/dance-event";
import {
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { FiMapPin, FiPlus } from "react-icons/fi";
import { useParams } from "react-router-dom";

const formattedDate = (date: string) => {
  return format(new Date(date), "E, MMM co, yyyy");
};

const EventDetails = () => {
  const eventId = useParams().id;
  const query = useQuery({
    queryKey: ["event-details", eventId],
    queryFn: async () => {
      const response = await authAxios.get(`/dance-event/${eventId}`);
      return response.data as DanceEvent;
    },
  });
  const battleCartQuery = useBattleCart();

  const [showAddCategoryDrawer, setShowAddCategoryDrawer] = useState(false);
  const [showLocationDrawer, setShowLocationDrawer] = useState(false);
  const [showAddUserDrawer, setShowAddUserDrawer] = useState<
    string | undefined
  >();

  return (
    <Container>
      <BattleCartIcon />
      {query.isLoading && <CircularProgress />}
      {query.data && (
        <div>
          <Typography variant="h5" fontWeight={900} gutterBottom>
            {query.data.eventName}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {formattedDate(query.data.startTime)} -{" "}
            {formattedDate(query.data.endTime)}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {query.data.city}
          </Typography>
          <Chip
            label={query.data.status}
            size="small"
            color="primary"
            sx={{ borderRadius: 0 }}
          />

          <div>
            <Stack direction="row" gap={1} mt={3} mb={2}>
              <Button
                startIcon={<FiPlus />}
                sx={{ textTransform: "capitalize" }}
                onClick={() => setShowAddCategoryDrawer((p) => !p)}
              >
                Catgeory
              </Button>
              <Button
                startIcon={<FiMapPin size={16} />}
                sx={{ textTransform: "capitalize" }}
                onClick={() => setShowLocationDrawer((p) => !p)}
              >
                Location
              </Button>
              <AssignRoleDropdown onRoleSelect={setShowAddUserDrawer} />
            </Stack>
            <Grid2 container spacing={2}>
              {query.data.categories.map((c) => {
                return (
                  <Grid2 key={c.id} size={{ xs: 12, md: 4 }}>
                    <EventCategoryCard
                      category={c}
                      isSelected={
                        battleCartQuery.data
                          ? Boolean(
                              battleCartQuery.data.find(
                                (d) => d.category.id === c.id
                              )
                            )
                          : false
                      }
                    />
                  </Grid2>
                );
              })}
            </Grid2>
          </div>

          <AddCategoryDrawer
            open={showAddCategoryDrawer}
            setOpen={setShowAddCategoryDrawer}
            eventId={+eventId!}
          />
          <AddUserDrawer
            title={showAddUserDrawer ?? ""}
            categories={query.data.categories}
            open={Boolean(showAddUserDrawer)}
            setOpen={setShowAddUserDrawer}
            eventId={+eventId!}
          />
          <AddLocationDrawer
            eventId={+eventId!}
            open={showLocationDrawer}
            setOpen={setShowLocationDrawer}
            categories={query.data.categories}
          />
        </div>
      )}

      {/* <Grid2 container spacing={0.5}>
        {images?.map((i) => {
          const url = URL.createObjectURL(i);
          return (
            <Grid2 key={i.name} size={{ xs: 6 }}>
              <img src={url} style={{ width: "100%", height: "auto" }} />
            </Grid2>
          );
        })}
      </Grid2> */}
      {/* <Stack>
        <Button fullWidth onClick={() => inputRef.current?.click()}>
          Add Poster
        </Button>
        <input
          onChange={(e) => {
            if (e.target.files) {
              setImages(Array.from(e.target.files));
            }
          }}
          ref={inputRef}
          type="file"
          multiple
          max={10}
          style={{ display: "none" }}
        />
      </Stack> */}
    </Container>
  );
};

export default EventDetails;
