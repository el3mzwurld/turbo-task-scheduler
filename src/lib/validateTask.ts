import type { DateKey, Task } from "./types";
import { fromDateKey, toDateKey } from "./utils";

export type TaskErrors = Partial<
  Record<"title" | "time" | "startDate" | "endDate" | "remindBefore", string>
>;

export type TaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">;

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const isValidDate = (key: DateKey): boolean => {
  return DATE_KEY_REGEX.test(key) && toDateKey(fromDateKey(key)) === key;
};

// active helper to produce error messages upon changes to a task
export const validateTask = (input: TaskInput): TaskErrors => {
  const errors: TaskErrors = {};
  const isDraft = input.status === "draft"; //check if the task was saved as a draft

  // title: required, even for drafts (the list needs something to display)
  if (!input.title.trim()) errors.title = "Give your task a title";

  // time is required for everything but drafts if it's present....check it's validity
  if (input.time === "") {
    if (!isDraft) errors.time = "Provide a time";
  } else if (!TIME_REGEX.test(input.time)) {
    errors.time = "Use a valid time HH:MM";
  }

  if (!isValidDate(input.startDate))
    errors.startDate = "Pick a valid start date";

  if (input.endDate !== null) {
    if (!isValidDate(input.endDate)) {
      errors.endDate = "Please provide a valid end date";
    } else if (!errors.startDate && input.endDate < input.startDate) {
      errors.endDate =
        "Invalid date : The end date cannot come before the start";
    }
  }

  // reminder isn't null ? if yes...check if it's an integer and not less than 0

  if (input.remindBefore !== null) {
    if (!Number(input.remindBefore) || input.remindBefore < 0) {
      errors.remindBefore = "Reminder must be zero (none) or more";
    }
  }

  return errors;
};

// simple helper to check if the form itself is valid
export const isTaskValid = (errors: TaskErrors): boolean =>
  Object.keys(errors).length === 0;
