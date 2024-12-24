import { Container, SwipeableDrawer, Typography } from "@mui/material";

interface Props {
  title: boolean;
  open: boolean;
  setOpen: (val: boolean) => void;
  eventId: number;
}

const AddJudgeDrawer = ({ title, open, setOpen }: Props) => {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Container sx={{ mt: 2, mb: 4, maxHeight: "80vh" }}>
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
      </Container>
    </SwipeableDrawer>
  );
};

export default AddJudgeDrawer;
