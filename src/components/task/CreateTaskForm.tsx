import { Button, Typography } from "@mui/material";
import { MotionBox, MotionStack } from "./../motion components/motion";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, {
  useEffect,
  useMemo,
  useState,
  type SetStateAction,
} from "react";
import type {
  DateKey,
  Priority,
  Repeat,
  Task,
  TaskCategory,
  Time,
} from "../../lib/types";
import { addDays, fromDateKey, getToday, toDateKey } from "../../lib/utils";
import {
  cleanSlate,
  dailyReminder,
  monthlyReminder,
  weeklyReminder,
} from "../../lib/templates";
import { setTarget } from "motion";
import {
  isTaskValid,
  isValidDate,
  validateTask,
  type TaskErrors,
  type TaskInput,
} from "../../lib/validateTask";
import { describeTask } from "../../lib/suggestor";
import { useTasks } from "../../hooks/useTasks";

const CreateTaskForm = () => {
  const nav = useNavigate();
  const [repeat, SetRepeat] = useState<Repeat>("once");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState<Task["category"]>(null);
  const [taskPriority, setTaskPriority] = useState<Priority>("normal");
  const [startDate, setStartDate] = useState<string>(() => {
    return getToday();
  });
  const [template, setTemplate] = useState<Partial<Task>>(cleanSlate);
  const [time, setTime] = useState<Time>("");
  const [remindBefore, setRemindBefore] = useState<Task["remindBefore"]>(null);
  const [endDate, setEndDate] = useState<DateKey | null>(null);

  const taskDraft: TaskInput = useMemo(
    () => ({
      title,
      notes,
      category,
      priority: taskPriority,
      startDate,
      time,
      remindBefore,
      endDate: repeat === "once" ? startDate : endDate,
      status: "draft",
      repeat,
    }),
    [
      title,
      notes,
      category,
      taskPriority,
      startDate,
      time,
      remindBefore,
      endDate,
      repeat,
    ],
  );

  const errors: TaskErrors = useMemo(
    () => validateTask(taskDraft),
    [taskDraft],
  );
  const { createTask } = useTasks();

  const createDraft = () => {
    if (!isTaskValid(errors)) return;

    const report = createTask(taskDraft);
    console.log(report.success);
    if (report.success) nav("/");
  };

  const create = () => {
    if (!isTaskValid(errors)) return;

    const report = createTask({ ...taskDraft, status: "active" });
    if (report.success) nav("/");
  };
  useEffect(() => {
    const templateChanges = () => {
      setTitle(template.title ?? "");
      setNotes(template.notes ?? "");
      setCategory(template.category ?? null);
      setTaskPriority(template.priority ?? "normal");
      setStartDate(template.startDate ?? getToday());
      setTime(template.time ?? "");
      setRemindBefore(template.remindBefore ?? null);
      SetRepeat(template.repeat ?? "once");
      setEndDate(template.endDate ?? getToday());
    };

    templateChanges();
  }, [template]);

  console.log(taskDraft);

  useEffect(() => {
    if (repeat === "once") setEndDate(getToday());
  }, [repeat]);

  return (
    <MotionStack
      spacing={2}
      sx={{
        alignItems: "center",
        width: "100%",
        padding: { xs: 0, md: "2em 6em" },
        minHeight: "100dvh",
        overflowX: "hidden",
        backgroundColor: "primary.main",
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
          <h2>New Schedule</h2>
          <Typography variant="subtitle2">
            Set up a task once and let it run on it's own.
          </Typography>
        </MotionStack>
        {/* templates */}
        <MotionBox
          sx={{
            display: "flex",
            gap: 2.5,
            alignItems: "center",
            overflowX: { xs: "auto", md: "hidden" },
            width: "auto",
            flex: 1,
          }}
        >
          <span>Start from a template</span>

          <TemplateContainer
            title="Daily Reminder"
            setTemplate={setTemplate}
            temp={dailyReminder}
          />
          <TemplateContainer
            title="Weekly Report"
            setTemplate={setTemplate}
            temp={weeklyReminder}
          />
          <TemplateContainer
            title="Monthly Review"
            setTemplate={setTemplate}
            temp={monthlyReminder}
          />
          <TemplateContainer
            title="Clean Slate"
            setTemplate={setTemplate}
            temp={cleanSlate}
          />
        </MotionBox>
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
                    <option value={getToday()}>After this run</option>
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
            // backgroundColor: "gray",
            flexBasis: { xs: "100%", md: "120px" },
            padding: { xs: "0em 1.25em", md: "0em 2.5em" },
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          <Panel
            mode="summary"
            task={taskDraft}
            makeDraft={createDraft}
            makeTask={create}
          />
          <Panel
            mode="action"
            task={taskDraft}
            makeDraft={createDraft}
            makeTask={create}
          />
        </MotionStack>
      </MotionStack>
    </MotionStack>
  );
};

export const TemplateContainer = ({
  title,
  setTemplate,
  temp,
}: {
  title: string;
  setTemplate: React.Dispatch<React.SetStateAction<Partial<Task>>>;
  temp: Partial<Task>;
}) => {
  function setTemp() {
    setTemplate(temp);
  }
  return (
    <Button
      sx={{
        py: 1.5,
        px: 1.5,
        border: "0.8px solid gray",
        borderRadius: "100px",
        fontSize: "0.8em",
        flex: "0 0 auto",
        color: "secondary.main",
        textTransform: "none",
      }}
      onClick={setTemp}
    >
      {title}
    </Button>
  );
};

export const Panel = ({
  mode,
  task,
  makeDraft,
  makeTask,
}: {
  mode: "summary" | "action";
  task: TaskInput | null;
  makeDraft: () => void;
  makeTask: () => void;
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
  return (
    <MotionStack
      spacing={1.5}
      sx={{
        width: "100%",
        padding: "1.2em",
        minHeight: 250,
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
            <h3>Summary</h3>

            <p>
              {description ??
                "Add a title and time to get a brief description of your task as well as the next time it will run where applicable."}
            </p>
          </div>
          {/* next runs */}

          <div style={{ width: "100%", display: "block" }}>
            <h4>Next runs</h4>

            <div>Nothing to see here yet.</div>
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
            onClick={makeTask}
          >
            Create Schedule
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

          {/* cancel */}
          <Button
            variant="text"
            sx={{ color: "secondary.main", width: "80%" }}
            onClick={() => {
              nav("/");
            }}
          >
            Cancel
          </Button>

          {/* footer */}
          <footer>
            <p>
              Title and time are needed to create. Drafts can be saved anytime.
            </p>
          </footer>
        </>
      )}
    </MotionStack>
  );
};
export default CreateTaskForm;
