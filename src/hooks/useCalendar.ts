/**
 * this allows the user to store selected dates in datekey forms
 * user can move between weeks and days
 * user can reset date to today as well
 * return : selectedDate, function to switch dates, weeks and reset day to today
 */

import { useCallback, useMemo, useState } from "react";
import type { DateKey } from "../lib/types";
import { addDays, getToday, getWeekKeys } from "../lib/utils";

export const useCalendar = () => {
  const [today] = useState<DateKey>(getToday()); //today
  const [selectedDate, SetSelectedDate] = useState<DateKey>(today);

  // get week days : derived from the selected date
  const weekDays = useMemo(() => getWeekKeys(selectedDate), [selectedDate]);
  // select another day
  const selectDate = useCallback((key: DateKey) => SetSelectedDate(key), []);
  // go to next Week
  const goToNextWeek = useCallback(
    () => SetSelectedDate((d) => addDays(d, 7)),
    [],
  );
  // go to previous week
  const goToPrevWeek = useCallback(
    () => SetSelectedDate((d) => addDays(d, -7)),
    [],
  );
  const resetToToday = useCallback(() => SetSelectedDate(today), [today]);

  return {
    selectedDate,
    selectDate,
    weekDays,
    goToNextWeek,
    goToPrevWeek,
    resetToToday,
  };
};
