import React from "react";

const TaskSummary = ({ title, count, bgColor }) => {
  return (
    <div
      className={`flex flex-col items-center ${bgColor} p-4 rounded-md w-1/2`}
    >
      <h3 className="text-lg text-[12px] md:text-[15px] font-semibold">
        {title}
      </h3>
      <div className="flex items-end justify-center gap-2">
        <span className="font-semibold text-[30px]">{count}</span>
        <p className="text-gray-500 text-[13px]">This week</p>
      </div>
    </div>
  );
};

export default TaskSummary;
