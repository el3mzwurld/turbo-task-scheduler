// local calendar type 'yyyy-mm-dd'

export type DateKey = string;

// local time HH:MM (24h)

export type Time = string;

export type Repeat = "once" | "daily" | "weekly" | "monthly";

export type TaskStatus = "draft" | "active" | "paused";

export type Priority = "low" | "normal" | "high";

export type TaskCategory = "Review" | "Self Learning" | "Development";

export interface Task {
  id: string; // random UUID
  title: string; //must have to create a draft
  notes: string; // '' when empty
  category: TaskCategory | null;
  priority: Priority;
  // date info
  startDate: DateKey; // lower boundary that will also serve for weekly and monthly platforming
  time: Time;
  repeat: Repeat;
  endDate: DateKey | null; // upper boundary...if null, task repeats it's schedule forever. For 'once' the end date = start date
  remindBefore: number | null; //minutes before the run...null, no reminder

  // life cycle
  status: TaskStatus;
  createdAt: number;
  updatedAt: number;
}

// this is stored...
// this only exists once something happens to an instance i.e finished or skipped
export interface InstanceRecord {
  taskId: string;
  date: DateKey; //which instance of the task, tracked solely by date
  result: "finished" | "skipped";
  recordedAt: number;
}

// look up key for each instance
export const instanceKey = (taskID: string, date: DateKey) =>
  `${taskID}:${date}`;

// always derived from the records once rendering happens
export interface TaskInstance {
  task: Task;
  date: DateKey; // only way to track actual instances tied to the dates they're meant for ex : "Wash plates on Wednesday 14th december"
  status: InstanceRecord["result"] | "pending";
}
