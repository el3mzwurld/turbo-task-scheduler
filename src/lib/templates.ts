import type { Task } from "./types";
import { getToday } from "./utils";

const dailyReminder: Partial<Task> = {
  title: "Daily Task name",
  notes: "",
  category: null,
  priority: "normal",
  startDate: getToday(),
  time: "",
  repeat: "daily",
  remindBefore: null,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  endDate: null,
};

const weeklyReminder: Partial<Task> = {
  title: "Weekly Task Name",
  notes: "",
  category: null,
  priority: "normal",
  startDate: getToday(),
  time: "",
  repeat: "weekly",
  remindBefore: null,
  endDate: null,
};

const monthlyReminder: Partial<Task> = {
  title: "Task title",
  notes: "",
  category: null,
  priority: "normal",
  startDate: getToday(),
  time: "",
  repeat: "monthly",
  remindBefore: null,
  endDate: null,
};

const cleanSlate: Partial<Task> = {
  title: "",
  notes: "",
  category: null,
  priority: "normal",
  startDate: getToday(),
  time: "",
  repeat: "once",
  remindBefore: null,
  endDate: null,
};

export { cleanSlate, monthlyReminder, dailyReminder, weeklyReminder };
