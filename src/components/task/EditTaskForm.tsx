import { Button, Typography } from "@mui/material";
import { MotionBox, MotionStack } from "./../motion components/motion";
import { ChevronLeft } from "lucide-react";
import { TemplateContainer } from "./CreateTaskForm";
import { Panel } from "./CreateTaskForm";
import { addDays, formatDate, getNextRuns, getToday } from "../../lib/utils";
import type {
  DateKey,
  Priority,
  Repeat,
  Task,
  TaskCategory,
  TaskStatus,
  Time,
} from "../../lib/types";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  isTaskValid,
  isValidDate,
  validateTask,
  type TaskErrors,
  type TaskInput,
} from "../../lib/validateTask";
import { useTasks } from "../../hooks/useTasks";
import { describeTask } from "../../lib/suggestor";
import { useCalendar } from "../../hooks/useCalendar";
const EditTaskForm = () => {
  const { id } = useParams();

  const {
    getTask,
    updateTask,
    removeTask,
    setStatus: editStatus,
    setInstanceStatus,
    nextRuns,
  } = useTasks();
  const template = getTask(id as string);

  const [repeat, SetRepeat] = useState<Repeat>("once");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState<Task["category"]>(null);
  const [taskPriority, setTaskPriority] = useState<Priority>("normal");
  const [startDate, setStartDate] = useState<string>(() => {
    return template ? template.startDate : getToday();
  });
  const [time, setTime] = useState<Time>("");
  const [remindBefore, setRemindBefore] = useState<Task["remindBefore"]>(null);
  const [endDate, setEndDate] = useState<DateKey | null>(null);
  const [status, setStatus] = useState<TaskStatus>("draft");
  const t: TaskInput = useMemo(
    () => ({
      title,
      repeat,
      notes,
      category,
      priority: taskPriority,
      startDate,
      endDate: repeat === "once" ? startDate : endDate,
      remindBefore,
      status,
      time,
    }),
    [
      title,
      repeat,
      notes,
      category,
      taskPriority,
      startDate,
      time,
      remindBefore,
      endDate,
      status,
    ],
  );
  const errors: TaskErrors = useMemo(() => validateTask(t), [t]);
  const nav = useNavigate();

  useEffect(() => {
    if (!template) return;

    const initializeForm = () => {
      setTitle(template.title);
      setNotes(template.notes);
      setCategory(template.category);
      setTaskPriority(template.priority);
      setStartDate(template.startDate);
      setTime(template.time ?? "");
      setRemindBefore(template.remindBefore ?? null);
      SetRepeat(template.repeat);
      setEndDate(template.endDate);
      setStatus(template.status);
    };

    initializeForm();
  }, []);

  const update = () => {
    if (!template) return;
    const report = updateTask(template.id, t);
    if (report.success) nav("/", { replace: true });
  };

  const saveDraft = () => {
    if (!template) return;
    // create a new draft
    updateTask(template.id, { ...t, status: "draft" });
  };

  const changeStatus = () => {
    if (!template) return;
    let s = status;
    //   toggle the status
    if (status === "active") {
      s = "paused";
      setStatus("paused");
    } else if (status === "paused" || status === "draft") {
      s = "active";
      setStatus("active");
    }

    editStatus(template.id, s);
  };

  const deleteSchedule = () => {
    if (!template) return;
    removeTask(template.id);
  };

  const markAsEnded = () => {
    if (!template) return;
    setInstanceStatus(template.id, getToday(), "finished");
  };
  const taskNextRuns = nextRuns(startDate, template);
  return (
    <MotionStack
      spacing={2}
      sx={{
        alignItems: "center",
        width: "100%",
        padding: { xs: 0, md: "2em 6em" },
        minHeight: "100dvh",
        overflowX: "hidden",
      }}
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeIn" }}
    >
      {/* header with templates */}
      <MotionStack spacing={1.5} sx={{ alignItems: "start", width: "100%" }}>
        {/* go back */}
        <Button
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            color: "secondary.main",
          }}
          onClick={() => nav(-1)}
        >
          <ChevronLeft size={14} /> Back to Tasks
        </Button>
        {/* text */}
        <MotionStack>
          <h2>Edit Schedule</h2>
        </MotionStack>
      </MotionStack>
      {/* form container */}
      <MotionStack
        spacing={2}
        direction={{ xs: "column", lg: "row" }}
        sx={{
          flexWrap: "wrap",
          flex: 1,
          width: "100%",
          //   alignItems: "flex-start",
        }}
      >
        {/* form */}
        <form
          className="task-form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="title">
            <h4>Task Details</h4>
          </div>
          {/* task title */}
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              placeholder="e.g. Send weekly report"
              type="text"
              defaultValue={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <footer style={{ color: "red" }}>
              {errors && errors.title
                ? errors.title
                : " Required. Keep it short so it reads well in your list."}
            </footer>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Add details, links or steps (optional)"
              defaultValue={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <MotionStack direction="row" spacing={1.5}>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                defaultValue={category ?? ""}
                id="category"
                name="category"
                onChange={(e) => {
                  const cat = e.target.value as TaskCategory;
                  setCategory(cat);
                }}
              >
                <option disabled value="">
                  Choose a category
                </option>
                <option value="Review">Review</option>
                <option value="Self Learning">Personal Learning</option>
                <option value="Development">Development</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                defaultValue={taskPriority}
                id="priority"
                name="priority"
                onChange={(e) => {
                  setTaskPriority(e.target.value as Priority);
                }}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
          </MotionStack>

          <div className="title">
            <h4>When</h4>
          </div>

          <MotionStack direction="row" spacing={1.5}>
            <div className="form-group">
              <label htmlFor="start-date">Start date *</label>
              <input
                defaultValue={startDate}
                id="start-date"
                name="startDate"
                type="date"
                onChange={(e) => setStartDate(e.target.value)}
              />

              <footer style={{ color: "red" }}>
                {errors && errors.startDate ? errors.startDate : null}
              </footer>
            </div>
            <div className="form-group">
              <label htmlFor="time">Time *</label>
              <input
                id="time"
                name="time"
                type="time"
                defaultValue={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <footer style={{ color: "red" }}>
                {errors && errors.time ? errors.time : null}
              </footer>
            </div>
          </MotionStack>

          <div className="form-group">
            <label>Repeat</label>
            <div className="form-repeat-group">
              <div
                className={`form-repeat ${repeat === "once" && "selected"}`}
                onClick={() => {
                  if (repeat === "once") return;
                  SetRepeat("once");
                }}
              >
                Once
              </div>
              <div
                className={`form-repeat  ${repeat === "daily" && "selected"}`}
                onClick={() => {
                  if (repeat === "daily") return;
                  SetRepeat("daily");
                }}
              >
                Daily
              </div>
              <div
                className={`form-repeat  ${repeat === "weekly" && "selected"}`}
                onClick={() => {
                  if (repeat === "weekly") return;
                  SetRepeat("weekly");
                }}
              >
                Weekly
              </div>
              <div
                className={`form-repeat  ${repeat === "monthly" && "selected"}`}
                onClick={() => {
                  if (repeat === "monthly") return;
                  SetRepeat("monthly");
                }}
              >
                Monthly
              </div>
            </div>
          </div>

          <MotionStack direction="row" spacing={1.5}>
            <div className="form-group">
              <label htmlFor="reminder">Remind me</label>
              <select
                defaultValue="15-minutes"
                id="reminder"
                name="reminder"
                onChange={(e) => setRemindBefore(Number(e.target.value))}
              >
                <option value={0}>At the time of the task</option>
                <option value={5}>5 minutes before</option>
                <option value={15}>15 minutes before</option>
                <option value={60}>1 hour before</option>
                <option value={1440}>1 day before</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="ends">Ends</label>
              <select
                defaultValue={endDate ?? "never"}
                id="ends"
                name="ends"
                onChange={(e) => {
                  const end =
                    e.target.value === "never" ? null : e.target.value;
                  setEndDate(end as Task["endDate"]);
                }}
              >
                {repeat === "once" ? (
                  <option value={getToday()}>After this run</option>
                ) : (
                  <>
                    <option value={"never"}>Never</option>
                    <option value={addDays(startDate, 7)}>
                      A week from now
                    </option>
                    <option value={addDays(startDate, 28)}>In a month</option>
                  </>
                )}
              </select>
            </div>
          </MotionStack>
        </form>
        <MotionStack
          spacing={1.5}
          sx={{
            flex: 2,
            flexBasis: { xs: "100%", md: "120px" },
            padding: { xs: 1.25, md: 2.5 },
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          <EditPanel
            mode="summary"
            task={t}
            makeDraft={saveDraft}
            update={update}
            remove={deleteSchedule}
            changeStatus={changeStatus}
            nextRuns={taskNextRuns}
            markAsFinished={markAsEnded}
          />
          <EditPanel
            mode="action"
            task={t}
            makeDraft={saveDraft}
            update={update}
            remove={deleteSchedule}
            changeStatus={changeStatus}
            markAsFinished={markAsEnded}
            nextRuns={taskNextRuns}
          />
        </MotionStack>
      </MotionStack>
    </MotionStack>
  );
};

export const EditPanel = ({
  mode,
  task,
  makeDraft,
  update,
  remove,
  changeStatus,
  markAsFinished,
  nextRuns,
}: {
  mode: "summary" | "action";
  task: TaskInput | null;
  makeDraft: () => void;
  update: () => void;
  remove: () => void;
  changeStatus: () => void;
  markAsFinished: () => void;
  nextRuns: Partial<Task>[];
}) => {
  const taskErrors = task
    ? validateTask(task)
    : { title: "Give your task a ttile" };
  const isValid = isTaskValid(taskErrors);
  const isDraft = task
    ? task.title.trim().length > 0 && isValidDate(task.startDate)
    : false;
  console.log(taskErrors);
  console.log(isValid);
  const nav = useNavigate();
  const description = task
    ? describeTask(task.title, task.repeat, task.remindBefore)
    : null;
  console.log(nextRuns);
  return (
    <MotionStack
      spacing={1.5}
      sx={{
        width: "100%",
        padding: "1.2em",
        minHeight: 256,
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: "white",
        borderRadius: 1.25,
      }}
    >
      {mode === "summary" && (
        <>
          {/* summary text */}
          <div style={{ width: "100%", display: "block" }}>
            <Typography variant="h6" sx={{ color: "text.disabled" }}>
              Summary
            </Typography>
            <p>
              {description ??
                "Add a title and time to get a brief description of your task as well as the next time it will run where applicable."}
            </p>
          </div>
          {/* next runs */}

          <div style={{ width: "100%", display: "block" }}>
            <Typography variant="h6" sx={{ color: "text.disabled" }}>
              Next runs
            </Typography>

            {nextRuns.length !== 0 ? (
              nextRuns.map((run, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1em",
                    width: "100%",
                    margin: "1em 0em",
                    justifyContent: "space-between",
                    flexDirection: "row-reverse",
                    borderBottom: "1px solid lightgray",
                    padding: "7.5px 5px",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 400, color: "text.disabled" }}
                  >
                    {run?.time}
                  </Typography>

                  {run.startDate && (
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatDate(run?.startDate, "short")}
                    </Typography>
                  )}
                </div>
              ))
            ) : (
              <div>Nothing to see here yet.</div>
            )}
          </div>
        </>
      )}

      {mode === "action" && (
        <>
          {/* create button */}
          <Button
            variant="contained"
            sx={{
              width: "80%",
              backgroundColor: isValid ? "secondary.main" : "text.disabled",
              color: isValid ? "text.secondary" : "lightgray",
              cursor: isValid ? "pointer" : "not-allowed",
            }}
            disabled={!isValid}
            onClick={update}
          >
            Save Changes
          </Button>
          {/* draft button */}
          <Button
            variant="outlined"
            sx={{
              width: "80%",
              color: isDraft ? "secondary.main" : "text.disabled",
              cursor: isDraft ? "pointer" : "not-allowed",
              border: "1.5px solid",
              borderColor: "secondary.main",
            }}
            disabled={!isDraft}
            onClick={makeDraft}
          >
            Save as Draft
          </Button>
          {/* change status */}
          <Button
            variant="contained"
            sx={{
              width: "80%",
              backgroundColor: isValid ? "secondary.main" : "text.disabled",
              color: isValid ? "text.secondary" : "lightgray",
              cursor: isValid ? "pointer" : "not-allowed",
            }}
            disabled={!isValid}
            onClick={changeStatus}
          >
            Toggle Status ({task?.status})
          </Button>
          <Button
            variant="text"
            sx={{ color: "secondary.main", width: "80%" }}
            onClick={markAsFinished}
          >
            Mark as done
          </Button>
          {/* remove */}
          <Button
            variant="text"
            sx={{ color: "secondary.main", width: "80%" }}
            onClick={remove}
          >
            Remove Schedule
          </Button>

          {/* footer */}
          <footer>
            <p style={{ fontSize: "0.8em" }}>
              Title and time are needed to create. Drafts can be saved anytime.
            </p>
          </footer>
        </>
      )}
    </MotionStack>
  );
};

export default EditTaskForm;
