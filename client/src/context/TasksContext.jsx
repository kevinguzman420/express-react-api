import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

// api
import {
  createTaskRequest,
  getTasksRequest,
  deleteTaskRequest,
  getTaskRequest,
  updateTaskRequest,
} from "../api/tasks";

export const useTasks = () => {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider ");
  }

  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => {
    try {
      const { data } = await getTasksRequest();
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async (task) => {
    const resp = await createTaskRequest(task);
    console.log(resp.data);
  };

  const deleteTask = async (id) => {
    try {
      const resp = await deleteTaskRequest(id);
      //   getTasks(); // option 1
      if (resp.status === 204)
        setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const getTask = async (id) => {
    try {
      const { data } = await getTaskRequest(id);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateTask = async (id, task) => {
    try {
      await updateTaskRequest(id, task);
      getTasks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TaskContext.Provider
      value={{ tasks, createTask, getTasks, deleteTask, getTask, updateTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};
