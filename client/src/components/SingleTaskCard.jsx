import React from "react";

const SingleTaskCard = ({
  task,
  handleTaskCompleted,
  handleDeleteTask,
  RiDeleteBin6Line,
  FaEdit,
  handleEdit,
}) => {
  return (
    <tr key={task.id} className="border-b-2 border-gray-300 ">
      <td className="flex items-center p-3">
        <input
          type="checkbox"
          checked={task?.isCompleted}
          className="mr-2"
          onChange={() => {
            handleTaskCompleted(task?._id);
          }}
        />
        <span
          className={`text-[13px] sm:text-md ${
            task?.isCompleted ? "line-through" : ""
          }`}
        >
          {task?.title}
        </span>
      </td>

      {/* Display the task date in DD/MM/YYYY format */}
      <td className="p-3 text-gray-500 text-[13px] sm:text-md">
        {(() => {
          const date = new Date(task.date);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        })()}
      </td>

      <td className="flex items-center justify-end p-3 gap-3 ">
        <button
          className="text-red-500 text-sm sm:text-md"
          onClick={() => handleDeleteTask(task?._id)}
        >
          <RiDeleteBin6Line className="text-gray-400 text-lg" />
        </button>
        <button
          className="text-blue-500 text-sm sm:text-md"
          onClick={() => handleEdit(task)}
        >
          <FaEdit className="text-gray-400 text-lg" />
        </button>
      </td>
    </tr>
  );
};

export default SingleTaskCard;
