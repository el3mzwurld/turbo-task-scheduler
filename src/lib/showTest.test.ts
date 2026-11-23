import { describe, expect, it } from "vitest";
import type { Task } from "./types";
import { dayHasTask, showTask } from "./utils";

const make = (over: Partial<Task>): Task => ({
  id: "t1",
  title: "Test",
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

describe("status", () => {
  it("never show drafts", () => {
    expect(showTask(make({ status: "draft" }), "2026-11-19")).toBe(false);
  });
  it("show paused tasks (they appear in the list)", () => {
    expect(showTask(make({ status: "paused" }), "2026-11-19")).toBe(true);
  });
});

describe("boundaries", () => {
  const t = make({
    repeat: "daily",
    startDate: "2026-11-19",
    endDate: "2026-11-21",
  });
  it("is false before start", () =>
    expect(showTask(t, "2026-11-18")).toBe(false));
  it("is inclusive of start and end", () => {
    expect(showTask(t, "2026-11-19")).toBe(true);
    expect(showTask(t, "2026-11-21")).toBe(true);
  });
  it("is false after end", () => expect(showTask(t, "2026-11-22")).toBe(false));
  it("repeats forever when endDate is null", () => {
    expect(showTask(make({ repeat: "daily" }), "2030-01-01")).toBe(true);
  });
});

describe("once", () => {
  const t = make({
    repeat: "once",
    startDate: "2026-11-19",
    endDate: "2026-11-19",
  });
  it("only matches its own date", () => {
    expect(showTask(t, "2026-11-19")).toBe(true);
    expect(showTask(t, "2026-11-20")).toBe(false);
    expect(showTask(t, "2026-11-18")).toBe(false);
  });
});

describe("weekly", () => {
  const t = make({ repeat: "weekly", startDate: "2026-11-19" }); // a Thursday
  it("matches the same weekday as the start", () => {
    expect(showTask(t, "2026-11-19")).toBe(true);
    expect(showTask(t, "2026-11-26")).toBe(true);
    expect(showTask(t, "2026-12-03")).toBe(true); // across a month boundary
  });
  it("skips other weekdays", () => {
    expect(showTask(t, "2026-11-20")).toBe(false);
    expect(showTask(t, "2026-11-25")).toBe(false);
  });
});

describe("monthly", () => {
  it("matches the same day of month", () => {
    const t = make({ repeat: "monthly", startDate: "2026-11-20" });
    expect(showTask(t, "2026-12-20")).toBe(true);
    expect(showTask(t, "2027-01-20")).toBe(true);
    expect(showTask(t, "2026-12-19")).toBe(false);
  });
  it("clamps a 31st anchor to the last day of shorter months", () => {
    const t = make({ repeat: "monthly", startDate: "2026-01-31" });
    expect(showTask(t, "2026-02-28")).toBe(true);
    expect(showTask(t, "2026-02-27")).toBe(false);
    expect(showTask(t, "2026-04-30")).toBe(true);
    expect(showTask(t, "2026-03-31")).toBe(true);
    expect(showTask(t, "2026-03-30")).toBe(false);
  });
  it("handles a Feb 29 anchor in non-leap years", () => {
    const t = make({ repeat: "monthly", startDate: "2028-02-29" });
    expect(showTask(t, "2028-03-29")).toBe(true);
    expect(showTask(t, "2029-02-28")).toBe(true);
    expect(showTask(t, "2032-02-29")).toBe(true);
    expect(showTask(t, "2032-02-28")).toBe(false);
  });
});

describe("hasTasksOn", () => {
  it("is true when any task showTask, false otherwise", () => {
    const task = make({ id: "a", repeat: "weekly", startDate: "2026-11-19" });
    const task2 = make({ id: "b", status: "draft", startDate: "2026-11-20" });
    expect(dayHasTask(task, "2026-11-19")).toBe(true);
    expect(dayHasTask(task2, "2026-11-20")).toBe(false); // draft doesn't count
  });
});
