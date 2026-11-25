import { Box, Typography } from "@mui/material";
import type { TaskInstance } from "../../lib/types";
import { MotionStack } from "../motion components/motion";

interface TaskGorupProps {
  title: string; // adjective based description of the day e,g today...tomorrow
  tasks: TaskInstance[];
}

export const TaskGroup = ({ title = "Today", tasks = [] }: TaskGorupProps) => {
  return (
    <MotionStack spacing={{ xs: 1.5, md: 2 }} sx={{ flex: 1 }}>
      {/* title */}
      <h3 className="title">{title}</h3>

      <MotionStack spacing={1} sx={{ width: "100%" }}>
        {tasks.map((t) => (
          <Instance instance={t} />
        ))}
      </MotionStack>
    </MotionStack>
  );
};

const Instance = ({ instance }: { instance: TaskInstance }) => {
  return (
    <MotionStack
      direction={"row"}
      spacing={2.5}
      sx={{
        width: "100%",
        padding: { xs: 0.8, md: 1 },
        alignItems: "center",
        justifyContent: "space-between",
        height: "3rem",
        fontSize: "1em",
        gap: 15,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {instance.task.time}
      </Typography>

      <div
        className="info"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <div
          style={{
            fontWeight: 500,
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            textAlign: "left",
          }}
        >
          <p>
            {" "}
            <Typography variant="body2" sx={{}}>
              {instance.task.title}
            </Typography>
          </p>
          <p>
            {" "}
            <Typography variant="subtitle2" sx={{}}>
              {instance.task.notes}
            </Typography>
          </p>
        </div>

        <div style={{ fontWeight: 500 }}>
          <p>
            {" "}
            <Typography variant="body2" sx={{}}>
              {instance.task.status}
            </Typography>
          </p>
        </div>
      </div>
    </MotionStack>
  );
};
