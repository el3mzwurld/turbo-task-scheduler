// this actions every task....takes in a state -> transforms it based on the action into another type of state
import { type Task, type DateKey, type TaskInstance } from "./types";
import type { TaskState } from "./../hooks/useTasks";
import { act } from "react";
export type TaskAction =
  | { type: "create"; task: Task }
  | { type: "edit"; task: Task }
  | { type: "remove"; id: string }
  | {
      type: "setInstance";
      taskId: string;
      date: DateKey;
      status: TaskInstance["status"];
      presentTime: number;
    };

export function TaskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "create":
      return { ...state, tasks: [...state.tasks, action.task] };

    case "edit":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.task.id ? action.task : t,
        ),
      };

    case "remove":
      return {
        records: state.records.filter((r) => r.taskId !== action.id),
        tasks: state.tasks.filter((t) => t.id !== action.id),
      };

    case "setInstance": {
      //   all other records
      const recs = state.records.filter(
        (r) => !(r.taskId === action.taskId && r.date === action.date),
      );

      //   if status is pending, don't add it to the records
      if (action.status === "pending") return { ...state, records: recs };

      return {
        ...state,
        records: [
          ...recs,
          {
            taskId: action.taskId,
            date: action.date,
            recordedAt: action.presentTime,
            result: action.status,
          },
        ],
      };
    }
  }
}
