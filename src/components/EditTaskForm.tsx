import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { updateTask } from "../services/taskService";

interface TaskType {
  title: string;
  description: string;
  category: string;
  dueDate: string;
  status: string;
}

interface EditTaskFormProps {
  setEditTask: React.Dispatch<React.SetStateAction<boolean>>;
  task: TaskType[];
  id: string;
  fetchTasks: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ setEditTask, task, id, fetchTasks }) => {
  console.log(task);

  const [tasks, setTasks] = useState<TaskType & { file: File | null }>({
    title: task[0].title,
    description: task[0].description,
    category: task[0].category,
    dueDate: task[0].dueDate,
    status: task[0].status,
    file: null,
  });

  console.log(tasks);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTasks({ ...tasks, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTasks({ ...tasks, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTask = {
      title: tasks.title || "",
      description: tasks.description || "",
      category: tasks.category || "Work",
      dueDate: tasks.dueDate || "",
      status: tasks.status || "Todo",
    };

    await updateTask(id, newTask);
    console.log("Task submitted:", newTask);

    setTasks({
      title: "",
      description: "",
      category: "Work",
      dueDate: "",
      status: "Todo",
      file: null,
    });

    fetchTasks();
    setEditTask(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm z-50">
      {/* Modal Box */}
      <div className="bg-white lg:w-3/5 max-w-4xl rounded-4xl shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={() => setEditTask(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl cursor-pointer"
        >
          <IoClose />
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-medium mb-4 pl-5 pt-5 h-16">Update Task</h2>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="p-5 border-t border-gray-300 lg:space-y-4">
          {/* Task Title */}
          <input
            type="text"
            name="title"
            value={tasks.title}
            onChange={handleChange}
            placeholder="Task title"
            className="w-full p-3 my-3 border bg-[#f1f1f1] border-gray-300 rounded-lg"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            value={tasks.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3 my-3 border bg-[#f1f1f1] border-gray-300 rounded-lg resize-none"
            rows={3}
          ></textarea>

          {/* Task Category, Due Date & Status */}
          <div className="flex flex-col lg:grid grid-cols-3 gap-4">
            {/* Task Category */}
            <div>
              <p className="text-gray-600 my-3">Task Category*</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`border border-gray-300 px-6 py-2 rounded-3xl ${
                    tasks.category === "Work" ? "bg-purple-500 text-white" : ""
                  }`}
                  onClick={() => setTasks({ ...tasks, category: "Work" })}
                >
                  Work
                </button>
                <button
                  type="button"
                  className={`border border-gray-300 px-6 py-2 rounded-3xl ${
                    tasks.category === "Personal" ? "bg-purple-500 text-white" : ""
                  }`}
                  onClick={() => setTasks({ ...tasks, category: "Personal" })}
                >
                  Personal
                </button>
              </div>
            </div>

            {/* Due Date */}
            <div className="my-3">
              <p className="text-gray-600">Due on*</p>
              <input
                type="date"
                name="dueDate"
                value={tasks.dueDate}
                onChange={handleChange}
                className="w-full p-2 border lg:my-3 bg-[#f1f1f1] border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Task Status */}
            <div className="my-3">
              <p className="text-gray-600">Task Status*</p>
              <select
                name="status"
                value={tasks.status}
                onChange={handleChange}
                className="w-full p-2 lg:my-3 border bg-[#f1f1f1] border-gray-300 rounded-lg"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* File Attachment */}
          <div className="my-3">
            <p className="text-gray-600">Attachment</p>
            <div className="border my-3 border-gray-300 p-4 bg-[#f1f1f1] rounded-lg text-center">
              <input type="file" onChange={handleFileChange} className="hidden" id="fileUpload" />
              <label htmlFor="fileUpload" className="flex justify-center">
                Drag your files here or{" "}
                <p className="text-blue-500 cursor-pointer underline ml-1">Update</p>
              </label>
              {tasks.file && <p className="text-gray-500 mt-2">{tasks.file.name}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="-m-5 pr-5 lg:pr-10 flex justify-end items-center mt-6 gap-4 bg-[#f1f1f1] h-20 rounded-b-4xl">
            <button
              type="reset"
              className="px-4 py-2 border border-gray-400 rounded-3xl uppercase cursor-pointer h-fit"
              onClick={() => setEditTask(false)}
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white uppercase rounded-3xl cursor-pointer h-fit">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskForm;
