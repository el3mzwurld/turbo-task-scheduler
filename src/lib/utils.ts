// transform time from utc

import {
  instanceKey,
  type DateKey,
  type InstanceRecord,
  type Task,
  type TaskInstance,
} from "./types";

/**
 * Does this task land on the specified date?
 *
 * Drafts are never supposed to show as they aren't scheduled yet.
 */
export const showTask = (task: Task, date: DateKey): boolean => {
  // if this is a draft, return no
  if (task.status === "draft") return false;

  // check boundaries
  if (date < task.startDate) return false;
  if (task.endDate !== null && date > task.endDate) return false;

  switch (task.repeat) {
    case "once":
      return date === task.startDate;
    case "daily":
      return true; // returns true always if the boundary check passes
    case "weekly":
      return getWeekDay(date) === getWeekDay(task.startDate);
    case "monthly":
      return (
        getDayofMonth(date) ===
        Math.min(getDayofMonth(task.startDate), daysInMonth(date)) //edge case for 29 days + works for months with 31 days as well
      );
  }
};

// pad the month and day to get 2 digit format
const pad = (n: number) => String(n).padStart(2, "0");

// take JS's native date type and return a datekey
export const toDateKey = (d: Date): DateKey => {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const fromDateKey = (d: DateKey): Date => {
  const [year, month, day] = d.split("-").map(Number);

  return new Date(year, month - 1, day);
};
export const formatDate = (d: DateKey, mode: "short" | "long"): string => {
  const [year, month, day] = d.split("-").map(Number);
  const date = fromDateKey(d);
  const weekday = new Intl.DateTimeFormat("en-GB", { weekday: mode }).format(
    date,
  );
  const monthName = new Intl.DateTimeFormat("en-GB", { month: mode })
    .format(date)
    .toLowerCase();

  return `${weekday}, ${day} ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`;
};
// create schedule multiplier
export const addDays = (key: DateKey, n: number): DateKey => {
  const d = fromDateKey(key);
  d.setDate(d.getDate() + n); //get next date
  return toDateKey(d);
};
//get day of the week 0-6....6 = saturday
export const getWeekDay = (key: DateKey): number => fromDateKey(key).getDay();
// returns what day it is in the month
export const getDayofMonth = (key: DateKey): number => Number(key.slice(8, 10));
// returns the number of days in the month
export const daysInMonth = (key: DateKey): number => {
  const date = fromDateKey(key);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

// get today
export const getToday = (): DateKey => toDateKey(new Date());
// full week in date key form
export const getWeekKeys = (key: DateKey): DateKey[] => {
  const offset = (getWeekDay(key) + 6) % 7; // this calculates what day of the week it is and how far it is from the first day of the week(in this case monday rather than sunday)
  const monday = addDays(key, -offset); //subtract the offset from the day
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i)); //loop through 0 to 7 and store the days into an array then return...this is the week
};
export const dayHasTask = (tasks: Task[], date: DateKey): boolean => {
  return tasks.some((t) => showTask(t, date));
};

export const getInstances = (
  tasks: Task[],
  taskRecords: Map<string, InstanceRecord>,
  dates: DateKey[],
): TaskInstance[] => {
  const instances: TaskInstance[] = [];

  for (const date of dates) {
    for (const task of tasks) {
      if (!showTask(task, date)) continue; //if the task doesn't match the date or it's a draft, skip.....
      const instanceRecord = taskRecords.get(instanceKey(task.id, date));

      instances.push({
        task,
        date,
        status: instanceRecord?.result ?? "pending",
      });
    }
  }
  return instances.sort(
    (a, b) =>
      a.date.localeCompare(b.date) || a.task.time.localeCompare(b.task.time),
  ); //sort by date
};

export const getNextRuns = (
  task: Task,
  taskRecords: Map<string, InstanceRecord>,
): Partial<Task>[] => {
  /**
   * the aim of this helper is to check for and return the next few possible runs of a specific task
   * Flow :
   * check for draft
   * Retrieve task id
   * check task repeat type, if it's once...return []
   * if it isn't once...check for the instances where the date is greater than today and the end date hasn't passed i.e greater than today
   * if nothing was found? return empty else...add partial tasks into the array
   */

  const nextRuns: Partial<Task>[] = [];

  // draft and repeat check
  if (task.status === "draft" || task.repeat === "once") return [];
  // get task id
  const id = task.id;

  // task repeat type isn't once....check records for where the date is greater than today
  taskRecords.forEach((value) => {
    const hasRun = id === value.taskId; //check each record and discern if they belong to that task

    if (!hasRun) return;

    // handle edge case where task might be infinite...so just push a partial record into the nextRuns array
    if (!task.endDate) {
      if (fromDateKey(task.startDate) < fromDateKey(value.date)) {
        const t: Partial<Task> = { startDate: value.date, time: task.time };
        nextRuns.push(t);
        return;
      } else {
        return;
      }
    }

    // task has endDate...handle
    if (
      fromDateKey(task.startDate) < fromDateKey(value.date) &&
      fromDateKey(task.endDate) > fromDateKey(value.date)
    ) {
      const t: Partial<Task> = { startDate: value.date, time: task.time };
      nextRuns.push(t);
      return;
    }
  });
  return nextRuns;
};
