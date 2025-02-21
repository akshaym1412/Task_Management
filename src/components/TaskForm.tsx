import React, { useState,useRef } from "react";
import { IoClose } from "react-icons/io5";
import { addTask } from "../services/taskService";
import { useSelector } from "react-redux";
import { uploadImageToCloudinary } from "../services/taskService";

interface Task {
  user: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  status: string;
  files?: string[];
}

interface TaskFormProps {
  setAddtask1: React.Dispatch<React.SetStateAction<boolean>>;
  fetchTasks: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ setAddtask1, fetchTasks }) => {

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const user = useSelector((state: any) => state.auth.user.email) as string;

  const [files, setFiles] = useState<string[]>([]);

  const [task, setTask] = useState<Task>({
    user: user,
    title: "",
    description: "",
    category: "Work",
    dueDate: "",
    status: "Todo",
    files: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("hi");
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
  
      // Uploading the image to Cloudinary
      const uploadedImageUrl = await uploadImageToCloudinary(file);
      console.log(uploadedImageUrl)
      if (uploadedImageUrl) {
        setFiles([...files, uploadedImageUrl]);
      }
  
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTask = {
      user,
      title: task.title || "",
      description: task.description || "",
      category: task.category || "Work",
      dueDate: task.dueDate || "",
      status: task.status || "Todo",
      files: files || []
    };
    
    await addTask(newTask);

    setTask({
      user,
      title: "",
      description: "",
      category: "Work",
      dueDate: "",
      status: "Todo",
      files: [],
    });

    fetchTasks();
    setAddtask1(false);
  };

  return (
<div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm z-50">
  <div className="bg-white lg:w-3/5 max-w-4xl h-[90vh] lg:h-[80vh] max-h-[90vh] rounded-4xl shadow-lg relative flex flex-col">

    <button
      onClick={() => setAddtask1(false)}
      className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl cursor-pointer"
    >
      <IoClose />
    </button>

    <h2 className="text-2xl font-medium pl-5 pt-5 pb-3 border-b border-gray-300">Create Task</h2>

    <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
      
      <div className="overflow-y-auto flex-grow p-5 max-h-[73vh] lg:max-h-[60vh]">
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Task title"
          className="w-full p-3 my-3 border bg-[#f1f1f1] border-gray-300 rounded-lg"
          required
        />
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-3 my-3 border bg-[#f1f1f1] border-gray-300 rounded-lg resize-none"
          rows={3}
        ></textarea>

        {/* Task Category, Due Date, Status */}
        <div className="flex flex-col lg:grid grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600 my-3">Task Category*</p>
            <div className="flex gap-2">
              <button
                type="button"
                className={`border border-gray-300 px-6 py-2 rounded-3xl ${
                  task.category === "Work" ? "bg-purple-500 text-white" : ""
                }`}
                onClick={() => setTask({ ...task, category: "Work" })}
              >
                Work
              </button>
              <button
                type="button"
                className={`border border-gray-300 px-6 py-2 rounded-3xl ${
                  task.category === "Personal" ? "bg-purple-500 text-white" : ""
                }`}
                onClick={() => setTask({ ...task, category: "Personal" })}
              >
                Personal
              </button>
            </div>
          </div>
          <div className="my-3">
            <p className="text-gray-600">Due on*</p>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              className="w-full p-2 border lg:my-3 bg-[#f1f1f1] border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="my-3">
            <p className="text-gray-600">Task Status*</p>
            <select
              name="status"
              value={task.status}
              onChange={handleChange}
              className="w-full p-2 lg:my-3 border bg-[#f1f1f1] border-gray-300 rounded-lg"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* File Upload */}
        <div className="my-3">
          <p className="text-gray-600">Attachment</p>
          <div className="border my-3 bg-[#f1f1f1] border-gray-300 p-4 rounded-lg text-center">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="fileUpload" />
            <label htmlFor="fileUpload" className="flex justify-center">
              Drag your files here or <p className="text-blue-500 cursor-pointer underline ml-1">Update</p>
            </label>
          </div>

          {/*it shows the Uploaded Files */}
          {files.length > 0 && (
            <ul className="text-gray-500 mt-2 flex gap-2">
              {files.map((file, index) => (
                <li key={index} className="relative w-24">
                  <img src={file} className="w-20 h-20 rounded-md" />
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 absolute right-0 top-0 cursor-pointer bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="p-5 flex justify-end items-center gap-4 bg-[#f1f1f1] border-t border-gray-300 sticky bottom-0">
        <button
          type="button"
          className="px-4 py-2 border border-gray-400 rounded-3xl uppercase cursor-pointer"
          onClick={() => setAddtask1(false)}
        >
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-purple-600 text-white uppercase rounded-3xl cursor-pointer">
          Create
        </button>
      </div>
    </form>
  </div>
</div>


  );
};

export default TaskForm;
