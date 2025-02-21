import React, { useState,useRef } from "react";
import { IoClose } from "react-icons/io5";
import { updateTask,uploadImageToCloudinary } from "../services/taskService";

export interface Activity {
  action: string; 
  timestamp: string;
  user: string; 
}

interface TaskType {
  user:string,
  title: string;
  description: string;
  category: string;
  dueDate: string;
  status: string;
  files?:string[];
  activities?: Activity[]
}

interface EditTaskFormProps {
  setEditTask: React.Dispatch<React.SetStateAction<boolean>>;
  task: TaskType[];
  id: string;
  fetchTasks: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ setEditTask, task, id, fetchTasks }) => {

  const [activeTab, setActiveTab] = useState("details");

  const oldTask={
    user:id,
    title: task[0].title,
    description: task[0].description,
    category: task[0].category,
    dueDate: task[0].dueDate,
    status: task[0].status,
    activities:task[0].activities,
    files: task[0].files || [],
  }

  const [tasks, setTasks] = useState<TaskType>({
    user:id,
    title: task[0].title,
    description: task[0].description,
    category: task[0].category,
    dueDate: task[0].dueDate,
    status: task[0].status,
    activities:task[0].activities,
    files: task[0].files || [],
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTasks({ ...tasks, [e.target.name]: e.target.value });
  };


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
  
      // Uploading the image to Cloudinary
      const uploadedImageUrl = await uploadImageToCloudinary(file);
      console.log(uploadedImageUrl)
      if (uploadedImageUrl) {
        setTasks((prevTasks) => ({
          ...prevTasks,
          files: [...(prevTasks.files || []), uploadedImageUrl],
        }));
      }
  
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const removeFile = (index: number, event: React.MouseEvent) => {
    event.stopPropagation(); 
  
    const updatedFiles = tasks.files?.filter((_, i) => i !== index);
    setTasks((prevTasks) => ({
      ...prevTasks,
      files: updatedFiles,
    }));
  
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
      files: tasks.files || []
    };

    await updateTask(id, newTask, oldTask);

    setTasks({
      user:id,
      title: "",
      description: "",
      category: "Work",
      dueDate: "",
      status: "Todo",
      files:[],
    });

    fetchTasks();
    setEditTask(false);
  };

  return (
<div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm z-50">
  <div className="bg-white lg:w-4/5 max-w-5xl rounded-4xl shadow-lg relative flex flex-col h-[90vh] lg:h-[80vh] max-h-[90vh]">
    
    {/* Close Button */}
    <button
      onClick={() => setEditTask(false)}
      className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl cursor-pointer"
    >
      <IoClose />
    </button>

    <h2 className="text-2xl font-medium pl-5 pt-5 pb-3 border-b border-gray-300">Update Task</h2>

    <form onSubmit={handleSubmit} className="flex flex-col flex-grow">

      <div className="lg:flex gap-5 p-5 overflow-hidden">
        <div className="flex lg:hidden justify-around">
          <button
            className={`px-12 py-2 text-center text-sm font-medium rounded-3xl ${
              activeTab === "details" ? "bg-black text-white" : "bg-gray-200"
            }`}
            onClick={(e) => {e.preventDefault();setActiveTab("details");e.stopPropagation()}}
          >
            DETAILS
          </button>
          <button
            className={`px-8 py-2 text-center text-sm font-medium rounded-3xl ${
              activeTab === "activity" ? "bg-black text-white" : "bg-gray-200"
            }`}
            onClick={(e) => {e.preventDefault();setActiveTab("activity");e.stopPropagation()}}
          >
            ACTIVITY
          </button>
        </div>
        
        {/*Details fields */}
        <div className={`${activeTab==="details" ? "" : "hidden"} lg:w-[65%] mt-5 overflow-y-auto pr-3 max-h-[61vh] lg:max-h-[60vh]`}>
          
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
            </div>
            {tasks.files  && (
            <ul className="text-gray-500 mt-2 flex gap-2">
              {tasks.files.map((file, index) => (
                <li key={index} className="relative w-24">
                  <img src={file} className="w-20 h-20 rounded-md" />
                  <button
                    onClick={(e) => removeFile(index, e)}
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

        {/* Activity Section */}
        <div className={`${activeTab==="activity" ? "" : "hidden lg:block"} mt-5 lg:w-[35%] overflow-y-auto lg:bg-[#f1f1f1] rounded-lg lg:p-3 max-h-[65vh] lg:max-h-[60vh]`}>
          <h1 className="font-normal text-[16px] mb-2 hidden lg:block">Activity</h1>
          {
            tasks?.activities?.map((activity, index) => (
              <div key={index} className="activity-item flex gap-2 mb-[6px] text-[12px] justify-between">
                <p className="w-[65%]">{activity.action}</p>
                <span className="w-[36%] text-end">{activity.timestamp}</span>
              </div>
            )
          ) }
        </div>
      </div>


      <div className={`${activeTab === "details" ? "" : "hidden"} p-5 flex justify-end items-center gap-4 bg-[#f1f1f1] border-t border-gray-300 sticky bottom-0`}>
        <button
          type="reset"
          className="px-4 py-2 border border-gray-400 rounded-3xl uppercase cursor-pointer"
          onClick={() => setEditTask(false)}
        >
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-purple-600 text-white uppercase rounded-3xl cursor-pointer">
          Update
        </button>
      </div>
    </form>
  </div>
</div>


  );
};

export default EditTaskForm;
