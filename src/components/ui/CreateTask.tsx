import { Plus } from "lucide-react";
import { MotionButton } from "../motion components/motion";
import { Typography } from "@mui/material";

interface CreateTaskProps {
  changeRender: () => void;
}

export const CreateTask = ({ changeRender }: CreateTaskProps) => {
  return (
    <MotionButton variant="contained" sx={{ display: "flex" }}>
      <Plus size={16} strokeWidth={1.75} />

      <Typography>New Schedule</Typography>
    </MotionButton>
  );
};
