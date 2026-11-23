import { describe, expect, it } from "vitest";
import type { Task } from "./types";
import { type TaskState, initialState } from "../hooks/useTasks";
import { TaskReducer } from "./taskReducer";
import { normalizeTaskInput } from "./normalizeTask";
const task = (over: Partial<Task> = {}): Task => ({
  id: "a",
  title: "T",
  notes: "",
  category: null,
  priority: "normal",
  startDate: "2026-11-19",
  time: "09:00",
  repeat: "daily",
  endDate: null,
  remindBefore: null,
  status: "active",
  createdAt: 0,
  updatedAt: 0,
  ...over,
});

describe("TaskReducer", () => {
  it("creates and replaces tasks", () => {
    let s = TaskReducer(initialState, { type: "create", task: task() });
    expect(s.tasks).toHaveLength(1);
    s = TaskReducer(s, { type: "edit", task: task({ title: "New" }) });
    expect(s.tasks[0].title).toBe("New");
  });

  it("records an instance, and changing it keeps one record per task+date", () => {
    let s = TaskReducer(initialState, { type: "create", task: task() });
    s = TaskReducer(s, {
      type: "setInstance",
      taskId: "a",
      date: "2026-11-19",
      status: "finished",
      presentTime: 1,
    });
    s = TaskReducer(s, {
      type: "setInstance",
      taskId: "a",
      date: "2026-11-19",
      status: "skipped",
      presentTime: 2,
    });
    expect(s.records).toHaveLength(1);
    expect(s.records[0].result).toBe("skipped");
  });

  it("finishing one date leaves other dates untouched", () => {
    let s = TaskReducer(initialState, { type: "create", task: task() });
    s = TaskReducer(s, {
      type: "setInstance",
      taskId: "a",
      date: "2026-11-19",
      status: "finished",
      presentTime: 1,
    });
    expect(s.records.find((r) => r.date === "2026-11-20")).toBeUndefined();
  });

  it("'pending' clears the record", () => {
    let s = TaskReducer(initialState, { type: "create", task: task() });
    s = TaskReducer(s, {
      type: "setInstance",
      taskId: "a",
      date: "2026-11-19",
      status: "finished",
      presentTime: 1,
    });
    s = TaskReducer(s, {
      type: "setInstance",
      taskId: "a",
      date: "2026-11-19",
      status: "pending",
      presentTime: 2,
    });
    expect(s.records).toHaveLength(0);
  });

  it("removing a task removes its records only", () => {
    let s = TaskReducer(initialState, { type: "create", task: task() });
    s = TaskReducer(s, { type: "create", task: task({ id: "b" }) });
    s = TaskReducer(s, {
      type: "setInstance",
      taskId: "a",
      date: "2026-11-19",
      status: "finished",
      presentTime: 1,
    });
    s = TaskReducer(s, {
      type: "setInstance",
      taskId: "b",
      date: "2026-11-19",
      status: "finished",
      presentTime: 1,
    });
    s = TaskReducer(s, { type: "remove", id: "a" });
    expect(s.tasks.map((t) => t.id)).toEqual(["b"]);
    expect(s.records.map((r) => r.taskId)).toEqual(["b"]);
  });
});

describe("normalizeTask", () => {
  it("trims and pins 'once' to a one-day boundary", () => {
    const { id, createdAt, updatedAt, ...input } = task({
      title: "  Hi  ",
      repeat: "once",
      endDate: null,
    });
    const out = normalizeTaskInput(input);
    expect(out.title).toBe("Hi");
    expect(out.endDate).toBe(out.startDate);
  });
});
