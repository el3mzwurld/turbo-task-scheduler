import { Box, Button, Typography } from "@mui/material";
import type { DateKey } from "../../lib/types";
import { MotionBox } from "../motion components/motion";
import { dayHasTask, formatDate } from "../../lib/utils";
import { useTasks } from "../../hooks/useTasks";
import { useCalendar } from "../../hooks/useCalendar";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface WeekTrayProps {
  weekDays: DateKey[];
  nextWeek: () => void;
  selectedDay: DateKey;
  selectDay: (date: DateKey) => void;
  prevWeek: () => void;
  reset: () => void;
}
export const WeekTray = ({
  weekDays,
  selectDay,
  selectedDay,
  nextWeek,
  prevWeek,
  reset,
}: WeekTrayProps) => {
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
        <div>
          <Button
            sx={{
              padding: { xs: "5px 15px" },
              color: "secondary.main",
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              textTransform: "none",
              fontSize: 14,
            }}
            onClick={prevWeek}
          >
            <ChevronLeft />
            Previous Week
          </Button>
        </div>
        <div>
          <Button
            sx={{
              padding: { xs: "5px 15px" },
              color: "secondary.main",
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              textTransform: "none",
              fontSize: 14,
            }}
            onClick={reset}
          >
            <Calendar />
            Go to Today
          </Button>
        </div>
        <div>
          <Button
            sx={{
              padding: { xs: "5px 15px" },
              color: "secondary.main",
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              textTransform: "none",
              fontSize: 14,
            }}
            onClick={nextWeek}
          >
            Next Week
            <ChevronRight />
          </Button>{" "}
        </div>{" "}
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
          const isSelectedDay = w === selectedDay;
          return (
            <MotionBox
              sx={{
                minHeight: { xs: 80 },
                flex: { xs: "0 0 auto" },
                width: { xs: 120, md: "15%", lg: "10%" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.5em",
                border: "2px solid",
                borderColor: "primary.dark",
                borderRadius: 1.8,
                backgroundColor: isSelectedDay
                  ? "secondary.main"
                  : "background.default",
                color: isSelectedDay ? "text.secondary" : "text.primary",
                cursor: "pointer",
              }}
              onClick={() => {
                selectDay(w);
              }}
            >
              {/* day */}
              <Typography variant="caption">{day}</Typography>
              {/* date */}
              <Typography variant="h5">{date}</Typography>

              <MotionBox
                className="task-id"
                sx={{
                  color: isSelectedDay ? "white" : "secondary.main",
                  fontSize: { xs: 18, md: 32 },
                  margin: 0,
                }}
              >
                {dayHasTask(tasks, w) ? "." : ""}
              </MotionBox>
            </MotionBox>
          );
        })}
      </Box>
    </>
  );
};
