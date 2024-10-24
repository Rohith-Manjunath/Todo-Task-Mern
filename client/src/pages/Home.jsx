import { useState } from "react"; // Import useState for state management
import { CiSearch } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../components/ui/button";

// Create an array of objects representing dates and days
const daysInWeek = [
  { date: 21, day: "SUN" },
  { date: 22, day: "MON" },
  { date: 23, day: "TUE" },
  { date: 24, day: "WED" },
  { date: 25, day: "THU" },
  { date: 26, day: "FRI" },
  { date: 27, day: "SAT" },
];

// Example task array
const tasks = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
  { id: 3, title: "Task 3", completed: false },
];

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 h-6">
      <div
        className={`bg-purple-950 h-full`}
        style={{ width: `${progress}%` }} // Set the width based on the progress prop
      />
    </div>
  );
};

const Home = () => {
  const progressValue = 60;

  // State for controlling the form visibility
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const handleCreateTask = () => {
    // Logic to create a new task
    console.log("Task Created:", {
      title: taskTitle,
      startTime,
      endTime,
      date: taskDate,
      description: taskDescription,
    });

    // Reset the form fields and close the form
    setTaskTitle("");
    setStartTime("");
    setEndTime("");
    setTaskDate("");
    setTaskDescription("");
    setDrawerOpen(false); // Close the drawer after creating the task
  };

  return (
    <div className="w-full max-w-[900px] h-[100vh] flex items-center justify-start pt-4 flex-col gap-4 mx-auto border-none outline-none">
      <div className="flex items-center justify-between gap-4 border w-full border-gray-300 rounded-md px-4 py-2">
        <input
          type="text"
          className="outline-none border-none w-full"
          placeholder="Search for a task"
        />
        <CiSearch className="text-gray-700 text-xl" />
      </div>

      <div className="grid grid-cols-7 gap-0 mt-4 w-full">
        {daysInWeek.map(({ date, day }) => (
          <div
            key={date}
            className="flex flex-col items-center p-4 rounded-md cursor-pointer hover:bg-blue-500 group hover:text-white transition-colors duration-300"
          >
            <span className="text-[11px] text-gray-400 group-hover:text-white">
              {day}
            </span>
            <span className="text-md text-gray-500 group-hover:text-white">
              {date}
            </span>
          </div>
        ))}
      </div>

      {/* Task Containers */}
      <div className="mt-2 w-full flex justify-between gap-8">
        {/* Completed Tasks */}
        <div className="flex flex-col items-center bg-green-100 p-4 rounded-md w-1/2">
          <h3 className="text-lg text-[14px] font-semibold ">Task Complete</h3>
          <div className="flex items-end justify-center gap-2">
            <span className="font-semibold text-[30px]">50</span>
            <p className="text-gray-500 text-[13px]">This week</p>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="flex flex-col items-center bg-red-100 p-4 rounded-md w-1/2">
          <h3 className="text-lg text-[14px] font-semibold ">Task Pending</h3>
          <div className="flex items-end justify-center gap-2">
            <span className="font-semibold text-[30px]">50</span>
            <p className="text-gray-500 text-[13px]">This week</p>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-center flex-col gap-3 w-full">
        <h4 className="font-semibold text-lg">Weekly Progress</h4>
        <ProgressBar progress={progressValue} />
      </div>

      <div className="w-full flex items-center justify-center gap-4">
        <div className="w-full flex items-center justify-between">
          <h5 className="font-semibold text-lg">Tasks Today</h5>
          <span className="text-[13px] text-blue-500">View All</span>
        </div>
      </div>

      {/* Task List */}
      <div className="mt-0 w-full flex flex-col gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 border-b-2 border-gray-300"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                className="mr-2"
                onChange={() => {
                  // Handle check change
                }}
              />
              <span
                className={`text-md ${task.completed ? "line-through" : ""}`}
              >
                {task.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-red-500">
                <RiDeleteBin6Line className="text-gray-400 text-lg" />
              </button>
              <button className="text-blue-500">
                <FaEdit className="text-gray-400 text-lg" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <div
        className="w-14 h-14 hover:cursor-pointer rounded-full bg-blue-500 text-white font-semibold flex items-center justify-center"
        onClick={() => setDrawerOpen(true)}
      >
        <span className="text-3xl">+</span>
      </div>

      {/* Drawer Component */}
      <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create New Task</DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col gap-4 p-4">
            <input
              type="text"
              placeholder="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="p-2 border border-gray-300 rounded outline-none"
            />
            <div className="grid grid-cols-2 w-full gap-2">
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="p-2 border border-gray-300 rounded outline-none"
                placeholder="Start"
              />
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="p-2 border border-gray-300 rounded outline-none"
                placeholder="Ends"
              />
            </div>
            <input
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              className="p-2 border border-gray-300 rounded outline-none"
            />
            <textarea
              rows={5}
              placeholder="Task Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="p-2 border border-gray-300 rounded outline-none resize-none"
            />
          </div>

          <DrawerFooter>
            <Button className="bg-blue-500" onClick={handleCreateTask}>
              Create Task
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Home;
