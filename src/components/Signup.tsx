import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../services/loginService";
import { LuNotepadText } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center md:gap-20 lg:gap-0 pt-40 md:pt-20 lg:pt-0 lg:justify-between w-full h-screen lg:pl-0 lg:p-5">
      <div className="flex flex-col justify-center items-center text-start lg:items-start lg:text-center md:text-left gap-3 px-5 lg:pl-20 w-full lg:w-[35%]">
        <div className="flex items-center gap-1">
          <LuNotepadText size={30} color="#7B1984" />
          <h1 className="text-[#7b1984] text-3xl lg:text-4xl font-semibold">
            TaskBuddy
          </h1>
        </div>

        <p className="w-full text-[13px] md:text-[16px] px-5 text-center lg:px-0 lg:text-start md:w-[400px]">
          Streamline your workflow and task progress effortlessly with our
          all-in-one task management app
        </p>
        <button
          className="bg-black rounded-2xl text-white px-6 py-2 mt-4 cursor-pointer flex items-center gap-2"
          onClick={() => handleLogin({ dispatch, navigate })}
        >
          <FcGoogle size={25} />
          <span className="font-semibold text-lg py-0.5">
            Continue with Google
          </span>
        </button>
      </div>

      <div className="flex justify-center items-center w-full md:w-[65%] mt-10 md:mt-0">
        <svg
          width="300"
          height="300"
          viewBox="0 0 745 773"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[220px] h-[220px] md:w-[300px] md:h-[300px] lg:w-[745px] lg:h-[650px]"
        >
          <circle
            cx="403.841"
            cy="407.1"
            r="352.442"
            stroke="#7B1984"
            strokeWidth="0.727435"
          />
          <circle
            cx="404.206"
            cy="405.282"
            r="280.063"
            stroke="#7B1984"
            strokeWidth="0.727435"
          />
          <circle
            cx="418.026"
            cy="417.648"
            r="416.82"
            stroke="#7B1984"
            strokeWidth="0.727435"
          />
        </svg>
      </div>
    </div>
  );
};

export default Signup;
