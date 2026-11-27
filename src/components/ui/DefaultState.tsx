import { Box, ReceiptRussianRuble } from "lucide-react";
import { useCalendar } from "../../hooks/useCalendar";
import { addDays, formatDate, getInstances, getToday } from "../../lib/utils";
import { MotionBox, MotionStack } from "../motion components/motion";
import { WeekTray } from "./WeekTray";
import { CreateTask } from "./CreateTask";
import { TaskGroup } from "../task/TaskGroup";
import { useTasks } from "../../hooks/useTasks";
import { useNavigate } from "react-router-dom";

interface DefaultStateProps {
  changeScreen: () => void;
}
export const DefaultState = () => {
  const date = formatDate(getToday(), "long");
  const {
    weekDays,
    selectedDate,
    selectDate,
    goToNextWeek,
    goToPrevWeek,
    resetToToday,
  } = useCalendar();
  const { tasks, records } = useTasks();

  // navigation
  const nav = useNavigate();

  const navigateToForm = () => {
    nav("/create");
  };
  // date
  const tomorrow = () => {
    return addDays(selectedDate, 1);
  };
  const I = getInstances(tasks, records, [selectedDate]);
  const Next = getInstances(tasks, records, [tomorrow()]);

  return (
    <MotionBox sx={{ flex: 1 }}>
      {/* header */}
      <MotionBox
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 45,
        }}
      >
        <div className="title">
          <h2>Schedules</h2>
          <p>{date}</p>
        </div>
        <div className="controls" style={{ display: "flex" }}>
          <input
            id="controls-schedule"
            name="control-schedule"
            type="text"
            placeholder="Search Schedules"
          ></input>
          <CreateTask changeRender={navigateToForm} />
        </div>
      </MotionBox>
      {/* week tray */}
      <WeekTray
        weekDays={weekDays}
        selectedDay={selectedDate}
        selectDay={selectDate}
        nextWeek={goToNextWeek}
        prevWeek={goToPrevWeek}
        reset={resetToToday}
      />
      {/* actual task display */}
      <MotionStack spacing={3.5} sx={{ width: "100%" }}>
        <TaskGroup tasks={I} title={"Today"} />

        <TaskGroup tasks={Next} title="Tomorrow" />
      </MotionStack>
    </MotionBox>
  );
};
