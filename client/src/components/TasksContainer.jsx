import React from "react";
import TaskSummary from "./TaskSummary"; // Adjust the path as necessary

const TasksContainer = ({ data }) => {
  const completedTasksCount = data?.filter((task) => task?.isCompleted).length;
  const pendingTasksCount = data?.filter((task) => !task?.isCompleted).length;

  return (
    <div className="mt-2 w-[90%] md:w-full flex justify-between gap-8 md:px-4">
      <TaskSummary
        title="Task Complete"
        count={completedTasksCount}
        bgColor="bg-green-100"
      />
      <TaskSummary
        title="Task Pending"
        count={pendingTasksCount}
        bgColor="bg-red-100"
      />
    </div>
  );
};

export default TasksContainer;
