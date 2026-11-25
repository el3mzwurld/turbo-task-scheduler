import {
  instanceKey,
  type DateKey,
  type InstanceRecord,
  type Task,
  type TaskInstance,
  type TaskStatus,
} from "../lib/types";
import { showTask, toDateKey } from "../lib/utils";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { TaskReducer } from "../lib/taskReducer";
import {
  isTaskValid,
  validateTask,
  type TaskErrors,
  type TaskInput,
} from "../lib/validateTask";
import { normalizeTaskInput } from "../lib/normalizeTask";

const STORAGE_KEY = "tempo.v1";

export interface TaskState {
  tasks: Task[];
  records: InstanceRecord[];
}

export const initialState: TaskState = {
  tasks: [],
  records: [],
};

type SaveReport =
  | { success: true; task: Task }
  | { success: false; reason: "invalid task item"; errors: TaskErrors } //validation or normalization error
  | { success: false; reason: "unavailable" }; // task not found
const loadTasks = (): TaskState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed?.tasks) && Array.isArray(parsed?.records))
      return parsed;
  } catch {
    // if nothing was found or there was any errors in storage, start from an initialized state
  }

  return initialState;
};

export function useTasks() {
  const [state, dispatch] = useReducer(TaskReducer, undefined, loadTasks);

  // holds all current state values which I'll further use for all action methods
  const stateRef = useRef<TaskState>(state);

  // if state changes, persist write to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const records = useMemo(() => {
    return new Map<string, InstanceRecord>(
      state.records.map((r) => [instanceKey(r.taskId, r.date), r]),
    );
  }, [state.records]);

  // create
  const createTask = useCallback((task: TaskInput): SaveReport => {
    const normalized = normalizeTaskInput(task); //normalize task input
    const errors = validateTask(task); //validate task input
    if (!isTaskValid(errors))
      return { success: false, reason: "invalid task item", errors };

    const present = Date.now();
    //   task input is valid, create and send to dispatch
    const cleanedTask: Task = {
      ...normalized,
      id: crypto.randomUUID(),
      createdAt: present,
      updatedAt: present,
    };
    dispatch({ type: "create", task: cleanedTask });
    return { success: true, task: cleanedTask };
  }, []);
  // update task details
  const updateTask = useCallback(
    (id: string, patch: Partial<TaskInput>): SaveReport => {
      /**
       * find the task
       * handle error if it wasn't found
       * spread the previous and the patch into a merged task object
       * check the date boundary....unless the patch was changed, use the initial version of the endDate
       * normalize and verify
       * send to dispatch
       * update and return report
       */
      //   find the task
      const currentVersion = stateRef.current.tasks.find((t) => t.id === id);
      if (!currentVersion) {
        return { success: false, reason: "unavailable" };
      }
      //   current version was found, merge
      const mergedVersion = { ...currentVersion, ...patch };

      //   if a boundary exists (i.e the repeat type isn't once)...check if the endDate from the patch is undefined. if it is....hard cap it to the initial state, this is going to be open for change sha, in case of infinite schedules

      if (
        currentVersion.repeat !== "once" &&
        mergedVersion.repeat !== "once" &&
        patch.endDate === undefined
      ) {
        mergedVersion.endDate = currentVersion.endDate;
      }

      // normalize
      const normalized = normalizeTaskInput(mergedVersion);
      const errors = validateTask(normalized);
      //   validate
      if (!isTaskValid(errors))
        return { success: false, reason: "invalid task item", errors };

      //   update and send to dispatch
      const task: Task = { ...normalized, updatedAt: Date.now() };
      dispatch({ type: "edit", task });
      return { success: true, task };
    },
    [],
  );
  // set status
  const setStatus = useCallback(
    (id: string, status: TaskStatus) => updateTask(id, { status }),
    [updateTask],
  );
  const endSeries = useCallback(
    (id: string, endDate: DateKey) => updateTask(id, { endDate }),
    [updateTask],
  );
  // remove task
  const removeTask = useCallback(
    (id: string) => dispatch({ type: "remove", id }),
    [],
  );

  const setInstanceStatus = useCallback(
    (id: string, date: DateKey, status: TaskInstance["status"]) => {
      const today = new Date();
      const key = toDateKey(today);
      // user shouldn't be able to finish a task on a day that isn't today
      if (date !== key) {
        if (status === "finished") return false;
      }

      const task = stateRef.current.tasks.find((t) => t.id === id);
      if (!task || !showTask(task, date)) return false; //check if the task is valid for that date
      //   send to dispatch
      dispatch({
        type: "setInstance",
        taskId: id,
        date,
        presentTime: Date.now(),
        status,
      });
      return true;
    },
    [],
  );

  return {
    tasks: state.tasks,
    records,
    createTask,
    updateTask,
    removeTask,
    endSeries,
    setStatus,
    setInstanceStatus,
  };
}
