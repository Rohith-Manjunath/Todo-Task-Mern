import { Box, CircularProgress } from "@mui/material";
import React from "react";

const SearchQueryTasks = ({
  tasks,
  handleTaskCompleted,
  RiDeleteBin6Line,
  handleEdit,
  handleDeleteTask,
  FaEdit,
  isLoading,
}) => {
  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <div className="w-full h-[90vh] mt-16 flex flex-col gap-4 overflow-auto p-4 absolute top-0 left-0 bg-white z-10">
          {tasks?.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task?._id}
                className="flex items-center justify-between p-3 border-b border-gray-300 w-full"
              >
                <div className="flex items-center relative">
                  <input
                    type="checkbox"
                    checked={task?.isCompleted}
                    className="mr-2 cursor-pointer"
                    onChange={() => handleTaskCompleted(task?._id)}
                  />
                  <span
                    className={`text-md ${
                      task?.isCompleted ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task?.title}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    className="text-red-500"
                    onClick={() => handleDeleteTask(task?._id)}
                  >
                    <RiDeleteBin6Line className="text-gray-400 text-lg" />
                  </button>
                  <button
                    className="text-blue-500"
                    onClick={() => handleEdit(task)}
                  >
                    <FaEdit className="text-gray-400 text-lg" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 text-lg p-6">
              No data available
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SearchQueryTasks;
