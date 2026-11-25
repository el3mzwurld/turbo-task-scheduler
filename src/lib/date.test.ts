import { describe, expect, it } from "vitest";
import { addDays, getWeekKeys } from "./utils";

describe("addDays", () => {
  it("crosses month ends", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
    expect(addDays("2026-12-01", -1)).toBe("2026-11-30");
  });
  it("crosses year ends", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2027-01-01", -1)).toBe("2026-12-31");
  });
  it("handles leap days", () => {
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2026-02-28", 1)).toBe("2026-03-01");
  });
  it("handles offsets of 0 and 7+", () => {
    expect(addDays("2026-11-19", 0)).toBe("2026-11-19");
    expect(addDays("2026-11-19", 7)).toBe("2026-11-26");
    expect(addDays("2026-11-19", -7)).toBe("2026-11-12");
  });
});

describe("getWeekKeys", () => {
  const week = [
    "2026-11-16",
    "2026-11-17",
    "2026-11-18",
    "2026-11-19",
    "2026-11-20",
    "2026-11-21",
    "2026-11-22",
  ];
  it("starts on Monday for a midweek date", () => {
    expect(getWeekKeys("2026-11-19")).toEqual(week);
  });
  it("keeps Sunday in the week that ends on it", () => {
    expect(getWeekKeys("2026-11-22")).toEqual(week);
  });
  it("keeps Monday as the first day", () => {
    expect(getWeekKeys("2026-11-16")).toEqual(week);
  });
  it("spans a month boundary", () => {
    expect(getWeekKeys("2026-12-02")).toEqual([
      "2026-11-30",
      "2026-12-01",
      "2026-12-02",
      "2026-12-03",
      "2026-12-04",
      "2026-12-05",
      "2026-12-06",
    ]);
  });
});
