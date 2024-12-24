import { DanceEventCategory } from "@/types/dance-event-category";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { FiAlertCircle, FiCheck, FiPlus } from "react-icons/fi";
import RolesSection from "./roles-section";
import { useMutation } from "@tanstack/react-query";
import { LoadingButton } from "@mui/lab";
import { authAxios } from "@/lib/auth-axios";
import toast from "react-hot-toast";

interface Props {
  isSelected: boolean;
  category: DanceEventCategory;
}

const EventCategoryCard = ({ category, isSelected }: Props) => {
  const addToBattleCartMutation = useMutation({
    mutationFn: async () => {
      const response = await authAxios.post("battle-cart", {
        eventId: category.eventId,
        categoryId: category.id,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Added to battle cart");
    },
  });

  const { judges, mcs, djs } = useMemo(() => {
    const judges = [];
    const mcs = [];
    const djs = [];
    for (const role of category.roles) {
      if (role.role === "dj") {
        djs.push(role);
      }
      if (role.role === "mc") {
        mcs.push(role);
      }
      if (role.role === "judge") {
        judges.push(role);
      }
    }
    return { judges, mcs, djs };
  }, [category]);

  const handleAddToBattleCart = () => {
    addToBattleCartMutation.mutate();
  };

  return (
    <Card>
      <CardHeader
        title={category.categoryName}
        titleTypographyProps={{
          textTransform: "capitalize",
          variant: "body1",
          fontWeight: 700,
        }}
        subheader={
          <Stack direction="row" component="span" gap={1} mt={0.5}>
            <Chip
              sx={{
                borderRadius: 0,
                textTransform: "capitalize",
              }}
              size="small"
              label={category.gender}
              component="span"
            />
            <Chip
              sx={{
                borderRadius: 0,
                textTransform: "capitalize",
              }}
              size="small"
              label={category.ageGroup}
              component="span"
            />
          </Stack>
        }
      />
      <CardContent>
        <Stack gap={2} divider={<Divider flexItem />}>
          <RolesSection roles={judges} type="judge" />
          <RolesSection roles={djs} type="dj" />
          <RolesSection roles={mcs} type="mc" />

          {category.location ? (
            <Box>
              <Typography variant="body2" fontWeight={500} gutterBottom>
                {category.location.venueName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {category.location.address}
              </Typography>
            </Box>
          ) : (
            <Alert
              color="warning"
              icon={<FiAlertCircle />}
              action={
                <Button
                  startIcon={<FiPlus />}
                  sx={{ textTransform: "capitalize" }}
                  color="inherit"
                  size="small"
                >
                  Add
                </Button>
              }
            >
              No location is assigned yet
            </Alert>
          )}
        </Stack>
      </CardContent>
      <CardActions>
        {isSelected ? (
          <Alert severity="success" icon={<FiCheck />} sx={{ width: "100%" }}>
            Already in the battle cart
          </Alert>
        ) : (
          <LoadingButton
            loading={addToBattleCartMutation.isPending}
            onClick={handleAddToBattleCart}
            startIcon={<FiPlus />}
            fullWidth
            variant="contained"
          >
            Battle Cart
          </LoadingButton>
        )}
      </CardActions>
    </Card>
  );
};

export default EventCategoryCard;
