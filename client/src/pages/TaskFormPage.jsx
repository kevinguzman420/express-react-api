import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export default function TasksPage() {
  const { register, handleSubmit, setValue } = useForm();

  const { createTask, getTask, updateTask } = useTasks();

  const navigate = useNavigate();
  const { id } = useParams();

  const onSubmit = (values) => {
    if (id) {
      createTask(id, { ...values, date: dayjs.utc(values.date).format() });
    } else {
      createTask({ ...values, date: dayjs.utc(values.date).format() });
    }
    navigate("/tasks");
  };

  useEffect(() => {
    async function loadTask() {
      if (id) {
        const task = await getTask(id);
        setValue("title", task.title);
        setValue("description", task.description);
        setValue("date", dayjs.utc(task.date).format("DD-MM-YYYY"));
      }
    }

    loadTask();
  }, []);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)] ">
      <div className=" bg-zinc-800 max-w-md w-full p-10 rounded-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            placeholder="Title"
            {...register("title")}
            autoFocus
            className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 "
          />

          <label htmlFor="description">Description</label>
          <textarea
            rows="3"
            placeholder="Description"
            {...register("description")}
            className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 "
          ></textarea>

          <label htmlFor="date">Data</label>
          <input
            type="date"
            {...register("date")}
            className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 "
          />

          <button className="bg-indigo-500 px-3 py-2 rounded-md">Save</button>
        </form>
      </div>
    </div>
  );
}
