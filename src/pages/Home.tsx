import React, { useState, useEffect } from "react";
import TaskForm from '../components/TaskForm';
import { addTask, deleteSelectedTasks, deleteTask, getTasks, updateSelectedTasksStatus } from "../services/taskService";
import EditTaskForm from "../components/EditTaskForm";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../services/loginService";
import { MdDragIndicator } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { LuNotepadText } from "react-icons/lu";
import { BiLogOut } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { CiViewBoard } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { CiCalendar } from "react-icons/ci";
import { BsArrowReturnLeft } from "react-icons/bs";
import { RiEdit2Fill } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

interface Task {
  id?: string;
  user: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  status: string;
  file?: File | null;
}

interface RootState {
  auth: {
    user: {
      email: string;
      displayName?: string;
      photoURL?: string;
    };
  };
}

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task>({
    user: user.email,
    title: "",
    description: "",
    category: "",
    dueDate: "",
    status: "",
    file: null,
  });
  const getVisibleCount = (status: string): number => visibleTasks[status] || 4;
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [visibleTasks, setVisibleTasks] = useState<Record<string, number>>({
    Todo: 4,
    "In Progress": 4,
    Completed: 4,
  });

  const [open, setOpen] = useState<Record<string, boolean>>({
    Todo: true,
    "In Progress": true,
    Completed: true,
  });

  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [multipleSelect, setMultipleSelect] = useState<boolean>(false);
  const [profile, setProfile] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [option, setOption] = useState<string>("");
  const [task, setTask] = useState<boolean>(false);
  const [isAddTask, setIsAddTask] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<string>("");
  const [category, setCategory] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("list");
  const [addTask1, setAddTask1] = useState<boolean>(false);
  const [filterDate, setFilterDate] = useState<string>("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getTasks(user?.email);
      setAllTasks(fetchedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTasks({ ...tasks, [e.target.name]: e.target.value });
  };

  const updateTaskField = (field: keyof Task, value: string) => {
    setTasks((prev) => ({
      ...prev,
      [field]: value,
    }));
    setTask(false);
    setCategory(false);
  };

  const handleOpen = (field: string, value: boolean) => {
    setOpen((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tasks.title || !tasks.dueDate || !tasks.category || !tasks.status) {
      setError("All fields required to submit");
      return;
    }

    const newTask: Task = {
      user: user.email,
      title: tasks.title,
      description: tasks.description,
      category: tasks.category,
      dueDate: tasks.dueDate,
      status: tasks.status,
    };
    await addTask(newTask);
    setTasks({
      user: "",
      title: "",
      description: "",
      category: "Work",
      dueDate: "",
      status: "Todo",
      file: null,
    });
    fetchTasks();
    setError("");
    setAddTask1(false);
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(taskId)
        ? prevSelected.filter((id) => id !== taskId)
        : [...prevSelected, taskId]
    );
  };

  const handleTask = (id: string) => {
    setEditTask(true);
    setTaskId(id);
  };

const filteredTasks = allTasks
  .filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
  .filter((task) => (filterStatus ? task.status.toLowerCase() === filterStatus.toLowerCase() : true))
  .filter((task) => (filterDate ? task.dueDate === filterDate : true));
  

  const sections = [
    { title: "Todo", color: "bg-[#fac3ff]", status: "Todo" },
    { title: "In Progress", color: "bg-[#85d9f1]", status: "In Progress" },
    { title: "Completed", color: "bg-[#ceffcc]", status: "Completed" },
  ];

  const visibleSections = searchQuery || filterStatus || filterDate
    ? sections.filter((section) =>
        filteredTasks.some((task) => task.status === section.status)
      )
    : sections;

  const handleLoadMore = (status: string) => {
    setVisibleTasks((prev) => ({
      ...prev,
      [status]: (prev[status] || 4) + 4,
    }));
  };

  const editedTask = allTasks.filter((task) => task.id === taskId);

  return (
    <div className='p-5 relative'>
        <header className='flex justify-between mb-5'>
            <div>
               
            <h1 className='text-xl flex items-center gap-2'> <LuNotepadText></LuNotepadText>TaskBuddy</h1>
            <div className='hidden lg:flex justify-between mt-3'>
               <h2  className={`cursor-pointer flex items-center gap-1 p-2 ${activeTab === "list" ? "font-bold border-b-2 border-blue-500" : "text-gray-500"}`} onClick={() => setActiveTab("list")}><GiHamburgerMenu size={15} className="text-gray-500" />List</h2>
               <h2  className={`cursor-pointer flex items-center gap-1 p-2 ${activeTab === "board" ? "font-bold border-b-2 border-blue-500" : "text-gray-500"}`} onClick={() => setActiveTab("board")}><CiViewBoard size={18} />Board</h2>
            </div>
            </div>
            <div>
            <div className="flex items-center gap-3 relative">
  <img 
    src={user?.photoURL} 
    alt="User Avatar" 
    className="w-10 h-10 rounded-full object-cover"
    onClick={()=>setProfile(!profile)}
  />
  {profile && <div className="absolute lg:hidden left-[-4.5rem] top-10 p-5 border py-3 rounded-2xl border-gray-300 bg-white">
    <div>{user?.displayName}</div>
    <div className="mt-2" onClick={() => handleLogout(dispatch, navigate)}>Logout</div>
    </div>}
  <h1 className="text-gray-700 font-medium hidden lg:block">{user?.displayName || "User"}</h1>
</div>
                
<button 
  className="hidden lg:flex items-center gap-2 px-4 py-1.5 cursor-pointer border rounded-2xl bg-[#fff9f9] mt-2 text-black hover:bg-gray-100 transition-all"
  onClick={() => handleLogout(dispatch, navigate)}
>
  <BiLogOut className="text-lg" />
  Logout
</button>
            </div>
   

        </header>
        <div className="flex justify-between items-center w-full lg:hidden">
  {/* Other content here */}
  
  <button className="bg-[#7b1984] text-white p-1 px-5 rounded-4xl uppercase cursor-pointer  ml-auto" 
    onClick={() => setAddTask1(true)}>
    Add Task
  </button>
</div>
        <div className='flex flex-col lg:flex-row gap-4 justify-between'>
        <div className='flex flex-col lg:flex-row gap-3 items-start lg:items-center'>
            <div>Filter by :</div>
            <div>
            <select name="category" id="category" className="border border-gray-400 p-1 rounded-3xl" onChange={handleFilterChange}>
  <option value="" disabled selected>Category</option>
  <option value="Todo">To-do</option>
  <option value="In Progress">In-progress</option>
  <option value="Completed">Completed</option>
  <option value="">None</option>
</select>
<div className={`relative inline-block ${filterDate ? "w-36" : "w-32"} ml-2`}>
      {/* Button */}
      <button
       onClick={() => (document.getElementById("due_date") as HTMLInputElement | null)?.showPicker()}
       className="flex items-center gap-2 px-4 pb-2  border border-gray-400 rounded-3xl text-gray-600 cursor-pointer w-full"
      >
        <CiCalendar className="text-xl" />
        {filterDate ? filterDate : "Due on"}
      </button>

      {/* Hidden Input */}
      <input
        type="date"
        id="due_date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="absolute inset-0 top-0 left-28 opacity-0 cursor-pointer"
      />
    </div>
</div>
        </div>
        <div className="flex lg:hidden items-center border border-gray-400 rounded-3xl px-4 py-2 w-[360px] ">
  <FiSearch className="text-gray-500 text-lg mr-2" />
  <input
    type="text"
    placeholder="Search"
    className="outline-none bg-transparent w-full"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>
        <div className='hidden lg:flex gap-5'>
        <div className="flex items-center border border-gray-400 rounded-3xl px-4 py-2 w-[250px]">
  <FiSearch className="text-gray-500 text-lg mr-2" />
  <input
    type="text"
    placeholder="Search"
    className="outline-none bg-transparent w-full"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>
            <button className='bg-[#7b1984] text-white p-1 px-5 rounded-4xl cursor-pointer' onClick={()=>setAddTask1(true)}>Add Task</button>
        </div>
        </div>
        {activeTab === "list" && <div id='task'>
           {visibleSections.length>0 && <div className="border-t hidden border-gray-300 mt-5 lg:grid grid-cols-1 lg:grid-cols-6 text-left font-semibold p-2">
  <h3 className="col-span-2">Task Name</h3>
  <h3 className="col-span-1">Due On</h3>
  <h3 className="col-span-1">Task Status</h3>
  <h3 className="col-span-2">Task Category</h3>
  <h3 className="col-span-1"></h3>
</div> }

            { visibleSections.length>0 ?visibleSections.map(({ title,color, status }) => (
  <div key={status} className={`bg-[#f1f1f1] ${open[status] ? "min-h-[300px]" : "h-auto"} mb-10 mt-8 lg:mt-0`}>
    { title === "Todo" ? 
    <div> <header className='bg-[#fac3ff] rounded-t-xl p-3 pl-3 flex justify-between text-lg font-[500] '>
                Todo ({allTasks.filter(task => task.status === "Todo").length})
                {open.Todo ? <IoIosArrowUp  size={25} className="font-semibold cursor-pointer" onClick={() => handleOpen("Todo", !open.Todo)}/> : <IoIosArrowDown size={25} className="font-semibold cursor-pointer" onClick={() => handleOpen("Todo", !open.Todo)}/>}
            </header>

            <div className="border-b-2 border-gray-300 w-full h-10 lg:flex items-center pl-7 hidden">
            <button className='cursor-pointer hidden lg:block ' onClick={()=>setIsAddTask(true)}><span className="text-2xl text-[#7b1984]">+</span> ADD TASK</button></div>
            { isAddTask && 
            <div className="border-b-2 border-gray-300 p-5 ">
            <div className='hidden lg:grid lg:grid-cols-6'>
                <input type='text' placeholder='Task Title' value={tasks.title} name="title" onChange={handleChange} className="col-span-2 w-96 px-3 border border-gray-300 rounded-lg focus:outline-none"></input>
                <div className="relative inline-block col-span-1 w-36">
      {/* Button */}
      <button
       onClick={() => (document.getElementById("dateInput") as HTMLInputElement | null)?.showPicker()}
       className="flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-3xl text-gray-600 cursor-pointer w-full"
      >
        <CiCalendar className="text-xl" />
        {tasks.dueDate ? tasks.dueDate : "Add date"}
      </button>

      {/* Hidden Input */}
      <input
        type="date"
        id="dateInput"
        value={tasks.dueDate}
        onChange={(e) => updateTaskField("dueDate",e.target.value)}
        className="absolute inset-0 top-0 left-28 opacity-0 cursor-pointer"
      />
    </div>
    <div className="flex items-center gap-3">
    <div className='border border-gray-300 text-2xl w-8 h-8 rounded-full flex justify-center mt-1 items-center pb-1 cursor-pointer relative col-span-1' onClick={()=>setTask(!task)}> +
    { task && <div className=' absolute start-5 top-7 p-2 text-[16px]  bg-white border border-gray-400 w-36 rounded-xl'>
        <h3 onClick={()=>updateTaskField("status", "Todo")}>TO-DO</h3>
        <h3 onClick={()=>updateTaskField("status", "In Progress")}>IN-PROGRESS</h3>
        <h3 onClick={()=>updateTaskField("status", "Completed")}>COMPLETED</h3>
    </div> }</div><div className="font-semibold">{tasks.status}</div></div>
    <div className="flex items-center gap-3">
    <div className='relative border border-gray-300 text-2xl w-8 h-8 rounded-full flex justify-center mt-1 pb-1 items-center cursor-pointer col-span-1' onClick={()=>setCategory(!category)}>+
    { category && <div className='absolute start-5 bg-white top-7 p-2 text-[16px] border border-gray-400 w-36 rounded-xl'>
        <h3 onClick={()=>updateTaskField("category", "Work")}>WORK</h3>
        <h3 onClick={()=>updateTaskField("category", "personal")}>PERSONAL</h3>
    </div> }</div><div className="font-semibold">{tasks.category}</div></div>
            </div>
            <div className='flex gap-3 mt-4'>
                <p className='bg-[#7b1984] text-white p-1 px-4 rounded-2xl cursor-pointer flex items-center gap-2 ' onClick={(e)=>handleSubmit(e)}>ADD<BsArrowReturnLeft size={18} /></p>
                <p className='p-1 cursor-pointer' 
                onClick={()=>{setIsAddTask(false),setError(""),
                    setTasks({
                    user:"",
                    title: "",
                    description: "",
                    category: "",
                    dueDate: "",
                    status: "",
                    file: null,
                  });}}>CANCEL</p>
                  {error!="" ? <div className="text-red-500 ml-5 mt-1 font-semibold">{error}</div> : <div></div>}
            </div>
            </div>}</div> :

    <header className={`${color} rounded-t-xl p-3 pl-3 flex justify-between text-lg font-[500]`}>{title} ({allTasks.filter((task: Task)=> task.status === status).length})
          {open[status] ? <IoIosArrowUp  size={25} className="font-semibold cursor-pointer" onClick={() => handleOpen(status, !open[status])}/> : <IoIosArrowDown size={25} className="font-semibold cursor-pointer" onClick={() => handleOpen(status, !open[status])}/>}
            </header>}
    {open[status] && (
      <div className="transition-all duration-300">
    {allTasks.filter((task: Task) => task.status === status).length === 0 && (
  <p className="text-center text-gray-500 p-4 mt-10 text-lg">No task in {title}</p>
)}
{allTasks
  .filter((task: Task) =>
    searchQuery
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        task.status === status
      : task.status === status
  )
  .slice(0, getVisibleCount(status)) 
  .map((task: Task) => (
    <div
      key={task.id}
      className="p-4 grid grid-cols-1 lg:grid-cols-6 items-center border-b border-gray-300 transition-all cursor-pointer duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:max-w-[1380px] hover:max-h-[50px] hover:p-2 hover:ml-12 hover:bg-white"
      onClick={() => {window.innerWidth >1500 ? undefined : handleTask(task.id as string)}}

    >
      <div className="col-span-2 flex">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedTasks.includes(task.id as string)}
            onChange={() => {toggleTaskSelection(task.id as string),setEditTask(false)}}
            className="cursor-pointer w-4 h-4 accent-[#7b1984]"
          />
          <MdDragIndicator className="hidden lg:block text-gray-400 text-xl" />
          <FaCheckCircle
            className={`${
              title === "In Progress" || title === "Todo"
                ? "text-gray-500"
                : "text-green-700"
            }`}
          />
        </div>
        <h2 className={`${title === "In Progress" || title === "Todo" ? "" : "line-through"} text-lg ml-3 flex-grow min-w-0 break-words`}>
        {task.title.length > 30 ? `${task.title.slice(0, 33)}...` : task.title}
        </h2>
      </div>
      <p className="lg:col-span-1 hidden lg:block">
      {new Date(task.dueDate).toDateString() === new Date().toDateString() ? "Today" : task.dueDate}</p>
      <span className="lg:col-span-1 text-md bg-[#dddadd] w-fit p-1.5 px-2.5 rounded-sm uppercase hidden lg:block">
        {task.status}
      </span>
      <p className="lg:col-span-1 hidden lg:block">{task.category}</p>
      <div className="relative col-span-1 text-center hidden lg:block">
        <button className="text-2xl font-bold cursor-pointer" onMouseEnter={() => setOption(task.id as string)}>
          ...
        </button>
        {option === task.id && (
          <div
            className="bg-white p-3 absolute top-0 left-[-20px] shadow-md rounded-md"
            onMouseLeave={() => setOption("")}
          >
            <p className="cursor-pointer hover:text-blue-600 flex items-center gap-2" onClick={() => handleTask(task.id as string)}>
            <RiEdit2Fill /> Edit
            </p>
            <p
              className="cursor-pointer text-red-500 hover:text-red-700 flex items-center gap-2"
              onClick={async () => {
                await deleteTask(task.id as string);
                setOption("");
                fetchTasks();
              }}
            >
             <RiDeleteBin6Line /> Delete
            </p>
          </div>
        )}
      </div>
    </div>
  ))}

{/* Load More Button */}
{visibleTasks[status] < allTasks.filter((task) => task.status === status).length && (
  <div className="text-center mt-4">
    <button
      onClick={() => handleLoadMore(status)}
      className="text-blue-400 underline cursor-pointer mb-2"
    >
      Load More
    </button>
  </div>
)}      </div>
)}
  </div>
)) : <img src="src/assets/image.png" className="h-40 w-48 lg:h-60 lg:w-80 mx-auto mt-40"></img>}

        </div>}
        {activeTab === "board" && 
  <div className="flex flex-col lg:flex-row gap-5 overflow-x-auto mt-5">
  {visibleSections.map(({ title, color, status }) => (
    <div key={status} className="bg-[#f1f1f1] min-h-[350px] lg:w-[450px] rounded-2xl p-3">
      <header className={`${color} rounded-lg p-1 px-3 w-fit`}>{title}</header>

      {filteredTasks.filter(task => task.status === status).length === 0 && (
  <p className="text-center text-gray-500 p-4 mt-36 text-lg">No task in {title}</p>
)}
      {filteredTasks
        .filter((task) => task.status === status)
        .map((task) => (
          <div key={task.id} className="mt-5 p-4 flex min-h-[7rem] flex-col bg-white justify-between rounded-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">{task.title.length > 30 ? `${task.title.slice(0, 33)}...` : task.title}</h2>
              <div className="relative col-span-1 text-center">
        <button className="text-2xl font-bold cursor-pointer mb-3" onMouseEnter={() => setOption(task.id as string)}>
          ...
        </button>
        {option === task.id && (
          <div
            className="bg-white p-3 absolute top-5 left-[-80px] shadow-md rounded-md"
            onMouseLeave={() => setOption("")}
          >
            <p className="cursor-pointer hover:text-blue-600 flex items-center gap-2" onClick={() => handleTask(task.id as string)}>
            <RiEdit2Fill /> Edit
            </p>
            <p
              className="cursor-pointer text-red-500 hover:text-red-700 flex items-center gap-2"
              onClick={async () => {
                await deleteTask(task.id as string);
                setOption("");
                fetchTasks();
              }}
            >
              <RiDeleteBin6Line /> Delete
            </p>
          </div>
        )}
      </div>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">{task.category}</p>
              <p className="text-gray-600">{task.dueDate}</p>
            </div>
          </div>
        ))}
    </div>
  ))}
</div>
        }

        {addTask1 && (
<TaskForm setAddtask1={setAddTask1} fetchTasks={fetchTasks}></TaskForm>
      )}

{editTask && (
     <EditTaskForm task={editedTask} setEditTask={setEditTask} id={taskId} fetchTasks={fetchTasks} ></EditTaskForm>
      )}
      {selectedTasks.length>0 &&
<div className="fixed bottom-5 left-1/2 w-[90%] lg:w-[25%] transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-6">
  <div className="flex gap-2 border border-gray-100 p-1 px-1.5 rounded-lg text-[12px]"><p>{selectedTasks.length} Tasks Selected</p> <p className="cursor-pointer" onClick={()=>setSelectedTasks([])} >X</p></div>
  <div className="relative">
     <button className="border border-gray-100 px-4 py-1 lg:py-2 rounded-3xl cursor-pointer" onMouseEnter={()=>setMultipleSelect(true)} onClick={()=>setMultipleSelect(!multipleSelect)}>Status</button>
    { multipleSelect && <div className="bg-black gap-1 text-white flex flex-col text-[13px] rounded-sm absolute top-[-6.5rem] p-3 w-[8rem] cursor-pointer" onMouseEnter={()=>setMultipleSelect(true)} onMouseLeave={()=>setMultipleSelect(false)}>
        <p onClick={()=>{setNewStatus("Todo"),updateSelectedTasksStatus(selectedTasks,newStatus,fetchTasks,setSelectedTasks),setMultipleSelect(false)}}>TO-DO</p>
        <p onClick={()=>{setNewStatus("In Progress"),updateSelectedTasksStatus(selectedTasks,newStatus,fetchTasks,setSelectedTasks),setMultipleSelect(false)}}>IN-PROGRESS</p>
        <p onClick={()=>{setNewStatus("Completed"),updateSelectedTasksStatus(selectedTasks,newStatus,fetchTasks,setSelectedTasks),setMultipleSelect(false)}}>COMPLETED</p>
     </div>}
     </div>
  <button
    className="border border-red-500 px-4 py-1 lg:py-2 rounded-3xl text-red-500"
    onClick={()=>deleteSelectedTasks(selectedTasks,fetchTasks,setSelectedTasks)}
  >
    Delete
  </button>
</div>}
    </div>
  )
}

export default Home