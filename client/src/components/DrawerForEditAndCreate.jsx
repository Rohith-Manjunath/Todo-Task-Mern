import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Box, CircularProgress } from "@mui/material";

const DrawerForEditAndCreate = ({
  isDrawerOpen,
  setDrawerOpen,
  isEditing,
  taskTitle,
  setTaskTitle,
  taskPriority,
  setTaskPriority,
  taskDate,
  setTaskDate,
  taskDescription,
  setTaskDescription,
  handleCreateTask,
  handleUpdateTask,
  id,
  createLoading,
  updateLoading,
}) => {
  return (
    <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {isEditing ? "Edit Task" : "Create New Task"}
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col gap-4 p-4">
          <label className="flex flex-col gap-1">
            <span className="font-medium text-gray-700 text-[12px]">
              Task Title
            </span>
            <input
              type="text"
              placeholder="Enter task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="p-2 border border-gray-300 rounded outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-medium text-gray-700 text-[12px]">
              Task Priority{" "}
              {isEditing && (
                <span
                  className={`${
                    taskPriority === "LOW"
                      ? "text-green-500" // Green for Low
                      : taskPriority === "MEDIUM"
                      ? "text-yellow-500" // Yellow for Medium
                      : taskPriority === "HIGH"
                      ? "text-red-500" // Red for High
                      : "text-gray-700" // Default color
                  }`}
                >
                  {taskPriority}
                </span>
              )}
            </span>
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              className="p-2 border border-gray-300 rounded outline-none"
            >
              <option value="">Select priority</option>
              {/* Render options based on taskPriority */}
              {taskPriority === "LOW" ? (
                <>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </>
              ) : taskPriority === "MEDIUM" ? (
                <>
                  <option value="LOW">LOW</option>
                  <option value="HIGH">HIGH</option>
                </>
              ) : taskPriority === "HIGH" ? (
                <>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                </>
              ) : (
                <>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </>
              )}
            </select>
          </label>
          <label className="flex flex-col gap-1 w-full">
            <span className="font-medium text-gray-700 text-[12px]">
              Set Date (Have to manually type date)
            </span>
            <input
              type="date"
              name="date"
              id="date"
              className="p-2 border border-gray-300 rounded outline-none"
              value={taskDate} // Prefill with the formatted date
              onChange={(e) => setTaskDate(e.target.value)} // Update state on change
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-medium text-gray-700 text-[12px]">
              Task Description
            </span>
            <textarea
              rows={5}
              placeholder="Optional task description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="p-2 border border-gray-300 rounded outline-none resize-none"
            />
          </label>
        </div>

        <DrawerFooter>
          <Button
            className="bg-blue-500 hover:bg-blue-400"
            onClick={isEditing ? () => handleUpdateTask(id) : handleCreateTask}
          >
            {isEditing
              ? updateLoading
                ? "Updating..."
                : "Update Task"
              : createLoading
              ? "Creating..."
              : "Create Task"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerForEditAndCreate;
