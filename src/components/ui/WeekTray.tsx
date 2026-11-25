import { Box, Typography } from "@mui/material";
import type { DateKey } from "../../lib/types";
import { MotionBox } from "../motion components/motion";
import { dayHasTask, formatDate } from "../../lib/utils";
import { useTasks } from "../../hooks/useTasks";

interface WeekTrayProps {
  weekDays: DateKey[];
  changeDay: () => void;
}
export const WeekTray = ({ weekDays }: WeekTrayProps) => {
  const { tasks } = useTasks();
  return (
    <>
      <Box
        sx={{
          padding: "1em 1.5em",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>{/* previous week */}</div>

        <div>{/* next week */}</div>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflowX: "auto",
          margin: "1em 0em",
          gap: { xs: 5 },
          padding: { md: "0em 1em" },
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {weekDays.map((w) => {
          const [d, date, month] = formatDate(w, "short")
            .split(" ")
            .map(String);
          const day = d.split(",");
          return (
            <MotionBox
              sx={{
                height: { xs: 80 },
                backgroundColor: "gray",
                flex: { xs: "0 0 auto" },
                width: { xs: 120, md: "15%", lg: "10%" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* day */}
              <Typography variant="caption">{day}</Typography>
              {/* date */}
              <Typography variant="h6">{date}</Typography>

              <div className="task-id">{dayHasTask(tasks, w) ? "." : ""}</div>
            </MotionBox>
          );
        })}
      </Box>
    </>
  );
};
