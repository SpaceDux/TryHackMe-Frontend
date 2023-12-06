import { createHook, createStore } from "react-sweet-state";
import { TaskType } from "./domain/Task.schema";

const TaskStore = createStore({
  initialState: {
    tasks: [] as TaskType[],
  },
  actions: {
    setTasks:
      (value: TaskType[]) =>
      ({ setState }) => {
        setState({ tasks: value });
      },
    clearStore:
      () =>
      ({ setState }) =>
        setState({ tasks: [] }),
  },
  name: "AuthStore",
});

export default createHook(TaskStore);
