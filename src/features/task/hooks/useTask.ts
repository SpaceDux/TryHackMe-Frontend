import { useState } from "react";
import { TaskSchema, TaskType } from "../domain/Task.schema";
import { CreateTaskSchema, CreateTaskType } from "../domain/CreateTask.schema";
import { useToast } from "@chakra-ui/react";

export default function useTask() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  /**
   * @description Get tasks from state
   * @returns {Task[]}
   */
  async function getTasksFromState(): Promise<TaskType[]> {
    if (!tasks.length) await getTasks();

    return tasks;
  }

  /**
   * @description Get all tasks from the API
   * @param {number} limit
   * @param {number} page
   * @returns {Promise<Task[]>}
   */
  async function getTasks(
    limit: number = 200,
    page: number = 0
  ): Promise<TaskType[]> {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/api/task/list?limit=${limit}&page=${page}`
      );
      const data = await response.json();

      // Validate using zod.
      const result = await TaskSchema.array().safeParseAsync(data);

      if (result.success === false) throw new Error(result.error?.message);

      setTasks(result.data);

      return data;
    } catch (error) {
      console.error("[useTask] getTasks error", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * @description Get single task from the API
   * @param {string} id
   * @returns {Promise<Task[]>}
   */
  async function getTask(id: string): Promise<TaskType> {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3001/api/task/${id}`);
      const data = await response.json();

      // Validate using zod.
      const result = await TaskSchema.safeParseAsync(data);

      if (result.success === false) throw new Error(result.error?.message);

      setLoading(false);

      return data;
    } catch (error) {
      console.error("[useTask] getTask error", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * @description Create a new task
   * @param {Task} task
   * @returns {Promise<Task>}
   */
  async function createTask(task: CreateTaskType): Promise<TaskType> {
    setLoading(true);

    try {
      // Validate using zod.
      const args = await CreateTaskSchema.safeParseAsync(task);
      if (args.success === false) throw new Error(args.error?.message);

      const response = await fetch(`http://localhost:3001/api/task/create`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(args.data),
      });
      const data = await response.json();

      // Validate using zod.
      const result = await TaskSchema.safeParseAsync(data);

      if (result.success === false) throw new Error(result.error?.message);

      await getTasks();

      return result.data;
    } catch (error) {
      console.error("[useTask] createTask error", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * @description Update a task
   * @param {Task} task
   * @returns {Promise<Task>}
   */
  async function updateTask(task: Partial<TaskType>): Promise<TaskType> {
    setLoading(true);

    try {
      // Validate using zod.
      const args = await TaskSchema.safeParseAsync(task);
      if (args.success === false) throw new Error(args.error?.message);

      const response = await fetch(
        `http://localhost:3001/api/task/update/${task.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify(args.data),
        }
      );
      const data = await response.json();

      // Validate using zod.
      const result = await TaskSchema.safeParseAsync(data);

      if (result.success === false) throw new Error(result.error?.message);

      // Update the tasks list.
      await getTasks();

      return result.data;
    } catch (error) {
      console.error("[useTask] updateTask error", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * @description Delete a task
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async function deleteTask(id: string): Promise<boolean> {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3001/api/task/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      return data.success;
    } catch (error) {
      console.error("[useTask] deleteTask error", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    tasks,
    loading,
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getTasksFromState,
  };
}
