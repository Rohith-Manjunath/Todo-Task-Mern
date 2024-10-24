import { useEffect, useState } from "react"; // Import useState for state management
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
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetSingleTaskQuery,
  useGetTasksQuery,
  useIsTaskCompletedMutation,
  useUpdateTaskMutation,
} from "../Redux/authApi";
import { useToast } from "@/hooks/use-toast";

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
        className="bg-purple-950 h-full transition-width duration-500 ease-in-out" // Apply transition here
        style={{ width: `${progress}%` }} // Set the width based on the progress prop
      />
    </div>
  );
};

const Home = () => {
  // State for controlling the form visibility
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const { data } = useGetTasksQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteTask] = useDeleteTaskMutation();
  const [taskComplete] = useIsTaskCompletedMutation();
  const [udpateTask] = useUpdateTaskMutation();
  const [id, setId] = useState("");
  const { data: singleTaskData } = useGetSingleTaskQuery(id);
  const [createTask] = useCreateTaskMutation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleDeleteTask = async (id) => {
    try {
      const data = await deleteTask({ id }).unwrap();
      toast({
        description: data?.message,
        className: "bg-green-500 text-white font-semibold tracking-wide", // Custom background and text color
      });
    } catch (e) {
      toast({
        description: e?.data?.message,
      });
    }
  };
  const handleTaskCompleted = async (id) => {
    try {
      const data = await taskComplete({ id }).unwrap();
      toast({
        description: data?.message,
        className: "bg-green-500 text-white font-semibold tracking-wide", // Custom background and text color
      });
    } catch (e) {
      toast({
        description: e?.data?.message,
      });
    }
  };
  const handleCreateTask = async () => {
    try {
      const data = await createTask({
        priority: taskPriority,
        date: "2024-10-25T14:00:00",
        description: taskDescription,
        title: taskTitle,
      }).unwrap();
      toast({
        description: data?.message,
        className: "bg-green-500 text-white font-semibold tracking-wide", // Custom background and text color
      });
      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("");
      setDrawerOpen(false);
    } catch (e) {
      toast({
        description: e?.data?.message,
      });
    }
  };
  const handleEdit = (task) => {
    setId(task._id);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskPriority(task.priority);
    setTaskDate(task.date);
    setIsEditing(true); // Set editing mode
    setDrawerOpen(true);
  };

  const handleUpdateTask = async (id) => {
    try {
      const data = await udpateTask({
        data: {
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority,
          date: taskDate,
        },
        id,
      }).unwrap();

      toast({
        description: data?.message,
      });
      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("");
      setTaskDate("");
      setIsEditing(false);
      setDrawerOpen(false);
      setId("");
    } catch (e) {
      toast({
        description: e?.data?.message,
      });
    }
  };
  // Calculate total and completed tasks
  const totalTasks = data?.length;
  const completedTasks = data?.filter((task) => task?.isCompleted).length;

  // Calculate progress percentage (Completed Tasks / Total Tasks * 100)
  const progressValue =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
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
          <h3 className="text-lg text-[14px] font-semibold">Task Complete</h3>
          <div className="flex items-end justify-center gap-2">
            <span className="font-semibold text-[30px]">
              {data?.filter((task) => task?.isCompleted).length}
            </span>
            <p className="text-gray-500 text-[13px]">This week</p>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="flex flex-col items-center bg-red-100 p-4 rounded-md w-1/2">
          <h3 className="text-lg text-[14px] font-semibold">Task Pending</h3>
          <div className="flex items-end justify-center gap-2">
            <span className="font-semibold text-[30px]">
              {data?.filter((task) => !task?.isCompleted).length}
            </span>
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
        {data?.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 border-b-2 border-gray-300"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task?.isCompleted}
                className="mr-2"
                onChange={() => {
                  handleTaskCompleted(task?._id);
                }}
              />
              <span
                className={`text-md ${task?.isCompleted ? "line-through" : ""}`}
              >
                {task?.title}
              </span>
            </div>

            {/* Priority div */}
            <div
              className={`px-3 py-1 rounded-full text-white font-semibold ${
                task?.priority === "Low"
                  ? "bg-green-500"
                  : task?.priority === "Medium"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {task?.priority}
            </div>

            <div className="flex items-center gap-2">
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
        ))}
      </div>

      {/* Floating Action Button */}
      <div
        className="w-14 h-14 hover:cursor-pointer rounded-full bg-blue-500 text-white font-semibold flex items-center justify-center"
        onClick={() => {
          setDrawerOpen(true);
        }}
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
            <input
              type="text"
              placeholder="Task Priority [Low, Medium, High]"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              className="p-2 border border-gray-300 rounded outline-none"
            />
            <div className="grid grid-cols-2 w-full gap-2"></div>
            <input
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              className="p-2 border border-gray-300 rounded outline-none"
            />
            <textarea
              rows={5}
              placeholder="Task Description (Optional)"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="p-2 border border-gray-300 rounded outline-none resize-none"
            />
          </div>

          <DrawerFooter>
            <Button
              className="bg-blue-500"
              onClick={
                isEditing
                  ? () => {
                      handleUpdateTask(id);
                    }
                  : handleCreateTask
              }
            >
              {isEditing ? "Update Task" : "Create Task"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Home;
