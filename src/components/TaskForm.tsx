import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { addTask } from "../services/taskService";
import { useSelector } from "react-redux";
import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Task {
  user: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  status: string;
  files: string;
}

interface TaskFormProps {
  setAddtask1: React.Dispatch<React.SetStateAction<boolean>>;
  fetchTasks: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ setAddtask1, fetchTasks }) => {
  const user = useSelector((state: any) => state.auth.user.email) as string;

  const [file, setFile] = useState<File | null>(null);

  const [task, setTask] = useState<Task>({
    user: user,
    title: "",
    description: "",
    category: "Work",
    dueDate: "",
    status: "Todo",
    files: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    setFile(e.target.files[0]); 
  }
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let fileURL = "";
    if (file) {
      const fileRef = ref(storage, `tasks_files/${file.name}`);
      await uploadBytes(fileRef, file);
      fileURL = await getDownloadURL(fileRef);
    }

    const newTask = {
      user,
      title: task.title || "",
      description: task.description || "",
      category: task.category || "Work",
      dueDate: task.dueDate || "",
      status: task.status || "Todo",
      file: fileURL
    };
    
    await addTask(newTask);
    console.log("Task submitted:", newTask);

    setTask({
      user,
      title: "",
      description: "",
      category: "Work",
      dueDate: "",
      status: "Todo",
      files: "",
    });

    fetchTasks();
    setAddtask1(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm z-50">
      <div className="bg-white lg:w-3/5 max-w-4xl rounded-4xl shadow-lg relative">
        <button
          onClick={() => setAddtask1(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl cursor-pointer"
        >
          <IoClose />
        </button>
        <h2 className="text-2xl font-medium mb-4 pl-5 pt-5 h-16">Create Task</h2>
        <form onSubmit={handleSubmit} className="p-5 border-t border-gray-300 lg:space-y-4">
          <input type="text" name="title" value={task.title} onChange={handleChange} placeholder="Task title" className="w-full p-3 my-3 border bg-[#f1f1f1] border-gray-300 rounded-lg" required />
          <textarea name="description" value={task.description} onChange={handleChange} placeholder="Description" className="w-full p-3 my-3 border bg-[#f1f1f1] border-gray-300 rounded-lg resize-none" rows={3}></textarea>
          <div className="flex flex-col lg:grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 my-3">Task Category*</p>
              <div className="flex gap-2">
                <button type="button" className={`border border-gray-300 px-6 py-2 rounded-3xl ${task.category === "Work" ? "bg-purple-500 text-white" : ""}`} onClick={() => setTask({ ...task, category: "Work" })}>Work</button>
                <button type="button" className={`border border-gray-300 px-6 py-2 rounded-3xl ${task.category === "Personal" ? "bg-purple-500 text-white" : ""}`} onClick={() => setTask({ ...task, category: "Personal" })}>Personal</button>
              </div>
            </div>
            <div className='my-3'>
              <p className="text-gray-600">Due on*</p>
              <input type="date" name="dueDate" value={task.dueDate} onChange={handleChange} className="w-full p-2 border lg:my-3 bg-[#f1f1f1] border-gray-300 rounded-lg" required />
            </div>
            <div className='my-3'>
              <p className="text-gray-600">Task Status*</p>
              <select name="status" value={task.status} onChange={handleChange} className="w-full p-2 lg:my-3 border bg-[#f1f1f1] border-gray-300 rounded-lg">
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div className='my-3'>
            <p className="text-gray-600">Attachment</p>
            <div className="border my-3 bg-[#f1f1f1] border-gray-300 p-4 rounded-lg text-center">
              <input type="file" onChange={handleFileChange} className="hidden" id="fileUpload" />
              <label htmlFor="fileUpload" className='flex justify-center'>Drag your files here or <p className="text-blue-500 cursor-pointer underline ml-1">Update</p></label>
              {file && <p className="text-gray-500 mt-2">{file.name}</p>}
            </div>
          </div>
          <div className="-m-5 pr-5 lg:pr-10 flex justify-end items-center mt-6 gap-4 bg-[#f1f1f1] h-20 rounded-b-4xl">
            <button type="reset" className="px-4 py-2 border border-gray-400 rounded-3xl uppercase cursor-pointer" onClick={() => setAddtask1(false)}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white uppercase rounded-3xl cursor-pointer">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
