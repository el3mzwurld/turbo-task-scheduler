import { Button, Typography } from "@mui/material";
import type { Task, TaskInstance } from "../../lib/types";
import { MotionButton, MotionStack } from "../motion components/motion";
import type { LucideIcon } from "lucide-react/types";
import { Check, Mail, Pause } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TaskGorupProps {
  title: string; // adjective based description of the day e,g today...tomorrow
  tasks: TaskInstance[];
}

export const TaskGroup = ({ title = "Today", tasks = [] }: TaskGorupProps) => {
  return (
    <MotionStack
      spacing={{ xs: 1.5, md: 2 }}
      sx={{ flex: 1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeIn" }}
    >
      {/* title */}
      <h3 className="title">{title}</h3>

      <MotionStack spacing={2} sx={{ width: "100%" }}>
        {tasks.map((t, index) => {
          return <Instance instance={t} key={index} />;
        })}
      </MotionStack>
    </MotionStack>
  );
};

const InstanceStatusMap: Record<
  Partial<Task["status"]>,
  { color: string; bg: string; icon: LucideIcon }
> = {
  active: { color: "#295a2a", bg: "success.light", icon: Check },
  paused: { color: "#fff", bg: "#6669698e", icon: Pause },
  draft: { color: "#fff", bg: "danger", icon: Mail },
};
const Instance = ({ instance }: { instance: TaskInstance }) => {
  const statusStyle = InstanceStatusMap[instance.task.status];
  const Icon = statusStyle.icon;
  const nav = useNavigate();
  const handleEdit = (id: string) => {
    nav(`/edit/${id}`);
  };
  return (
    <MotionStack
      layout
      direction={"row"}
      spacing={2.5}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      sx={{
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "2rem",
        fontSize: "1em",
        gap: 15,
        border: "0.2px solid",
        padding: "1em 1.5em",
        borderRadius: 1.5,
        borderColor: "primary.dark",
        backgroundColor: "background.default",
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {instance.task.time}
      </Typography>

      <div
        className="info"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        <div
          style={{
            fontWeight: 500,
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            textAlign: "left",
            width: "30%",
          }}
        >
          <p>
            {" "}
            <Typography
              variant="body2"
              sx={{ fontSize: "1em", color: "text.primary", fontWeight: 600 }}
            >
              {instance.task.title}
            </Typography>
          </p>
          <p>
            {" "}
            <Typography
              variant="subtitle2"
              sx={{ fontSize: 14, color: "text.disabled" }}
            >
              {instance.task.notes}
            </Typography>
          </p>
        </div>

        <p>
          {" "}
          <Typography
            variant="body2"
            sx={{
              fontSize: 12,
              px: 1.5,
              py: 1,
              backgroundColor: statusStyle.bg,
              color: statusStyle.color,
              borderRadius: "100px",
              display: "flex",
              alignItems: "center",
              gap: 2,
              fontWeight: 600,
            }}
          >
            <Icon size={12} />
            {instance.task.status}
          </Typography>
        </p>
        <MotionButton
          variant="outlined"
          sx={{
            padding: "0.2em 1.5em",
            color: "secondary.main",
            border: "1px solid",
            fontWeight: 600,
            textTransform: "none",
          }}
          onClick={() => handleEdit(instance.task.id)}
        >
          Edit
        </MotionButton>
      </div>
    </MotionStack>
  );
};
