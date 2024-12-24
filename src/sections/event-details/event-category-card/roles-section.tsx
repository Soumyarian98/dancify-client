import { DanceEventRole } from "@/types/dance-event-role";
import { Alert, Avatar, Box, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { FiAlertCircle } from "react-icons/fi";

interface Props {
  type: DanceEventRole["role"];
  roles: DanceEventRole[];
}

const RolesSection = ({ roles, type }: Props) => {
  const { title, alertMessage } = useMemo(() => {
    if (type === "dj")
      return { title: "Djs", alertMessage: "No Djs assigned yet" };
    if (type === "judge")
      return { title: "Judges", alertMessage: "No Judges assigned yet" };
    return { title: "Mcs", alertMessage: "No Mcs assigned yet" };
  }, [type]);

  if (roles.length === 0) {
    return (
      <Alert color="warning" icon={<FiAlertCircle />}>
        {alertMessage}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="body2" fontWeight={700} mb={1.5}>
        {title}
      </Typography>
      {roles.map((r) => {
        return (
          <Stack key={r.id} direction="row" gap={1} alignItems="center">
            <Avatar
              variant="rounded"
              sx={{ width: 40, height: 40 }}
              src={r.user.profilePicture}
            >
              {r.user.name.slice(0, 2)}
            </Avatar>
            <div>
              <Typography variant="body2" component="p">
                {r.user.stageName}
              </Typography>
              <Typography
                variant="caption"
                component="p"
                color="text.secondary"
              >
                {r.user.name}
              </Typography>
            </div>
          </Stack>
        );
      })}
    </Box>
  );
};

export default RolesSection;
