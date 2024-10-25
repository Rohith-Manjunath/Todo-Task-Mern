import React from "react";

const DaysInWeeksContainer = ({ daysInWeek, currentDate }) => {
  return (
    <div className="grid grid-cols-7 gap-0 w-[90%] lg:w-full">
      {daysInWeek?.map(({ date, day }) => (
        <div
          key={date}
          className={`flex flex-col items-center p-4 rounded-md cursor-pointer group transition-colors duration-300 ${
            date === currentDate
              ? "bg-blue-500 text-white" // Highlight style for today
              : "hover:bg-blue-500 hover:text-white" // Default hover style for other days
          }`}
          onClick={() => {
            const formattedDate = `${String(date).padStart(2, "0")}/10/2024`; // Format to DD/MM/YYYY
            console.log(formattedDate);
          }} // Log formatted date on click
        >
          <span
            className={`text-[11px] ${
              date !== currentDate ? "text-gray-400" : "text-white"
            } group-hover:text-white`}
          >
            {day}
          </span>
          <span
            className={`text-md ${
              date !== currentDate ? "text-gray-400" : "text-white"
            } group-hover:text-white`}
          >
            {date}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DaysInWeeksContainer;
