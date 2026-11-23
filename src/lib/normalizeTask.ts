import type { TaskInput } from "./validateTask";

export const normalizeTaskInput = <T extends TaskInput>(input: T): T => {
  const exp = {
    ...input,
    title: input.title.trim(),
    notes: input.notes.trim(),
  };

  if (exp.repeat === "once") exp.endDate = exp.startDate;

  return exp;
};
