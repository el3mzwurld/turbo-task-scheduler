import type { Repeat } from "../lib/types";

const REPEATS: Record<Repeat, string> = {
  once: "run once",
  daily: "repeat every day",
  weekly: "repeat every week",
  monthly: "repeat every month",
};

function reminderText(min: number): string {
  if (min === 0) return "at the time it runs";
  if (min % 1440 === 0)
    return `${min / 1440} day${min === 1440 ? "" : "s"} before`;
  if (min % 60 === 0) return `${min / 60} hour${min === 60 ? "" : "s"} before`;
  return `${min} minute${min === 1 ? "" : "s"} before`;
}

export function describeTask(
  title: string,
  repeat: Repeat,
  remindBefore: number | null,
): string {
  const name = title.trim() || "This task";
  const reminder =
    remindBefore === null
      ? ""
      : `, with a reminder ${reminderText(remindBefore)}`;
  return `${name} will ${REPEATS[repeat]}${reminder}.`;
}
