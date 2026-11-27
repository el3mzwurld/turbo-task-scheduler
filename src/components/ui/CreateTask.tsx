import { Plus } from "lucide-react";
import { MotionButton } from "../motion components/motion";
import { Typography } from "@mui/material";

interface CreateTaskProps {
  changeRender: () => void;
}

export const CreateTask = ({ changeRender }: CreateTaskProps) => {
  return (
    <MotionButton
      variant="contained"
      sx={{
        display: "flex",
        padding: { xs: "5px 10px", md: "0.5em 1em" },
        alignItems: "center",
        gap: 0.8,
        backgroundColor: "secondary.main",
        color: "primary.main",
        fontWeight: 600,
      }}
      onClick={changeRender}
    >
      <Plus size={16} strokeWidth={1.75} />

      <Typography variant="body2" sx={{}}>
        New Schedule
      </Typography>
    </MotionButton>
  );
};
