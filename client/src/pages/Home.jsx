import { useEffect, useState } from "react"; // Import useState for state management
import { CiSearch } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
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
import { FaArrowLeft } from "react-icons/fa";

// Function to get dates from last Sunday to next Saturday
const getWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay();

  // Find last Sunday
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - currentDay);

  // Create array to store dates for the week
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(lastSunday);
    day.setDate(lastSunday.getDate() + i);
    weekDates.push({
      date: day.getDate(),
      day: day.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    });
  }

  return weekDates;
};

const daysInWeek = getWeekDates();
// Get the current date
const today = new Date();
const currentDate = today.getDate();

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
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const handleDeleteTask = async (id) => {
    try {
      const data = await deleteTask({ id }).unwrap();
      toast({
        description: data?.message,
        className: "bg-green-500 text-white font-semibold tracking-wide", // Custom background and text color
      });
      if (debouncedQuery) {
        getData(debouncedQuery);
      }
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
      if (debouncedQuery) {
        getData(debouncedQuery);
      }
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
      if (debouncedQuery) {
        getData(debouncedQuery);
      }
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

  useEffect(() => {
    // Set a timeout to update the debounced query after the user stops typing
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms debounce time

    // Cleanup function to clear the timeout if the user types again before the delay ends
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]); // Effect runs whenever searchQuery changes

  useEffect(() => {
    // Trigger the data fetch only when the debounced query changes
    if (debouncedQuery) {
      getData(debouncedQuery);
    }
  }, [debouncedQuery]);

  const getData = async (query) => {
    try {
      let response = await fetch(
        `http://localhost:4000/api/tasks/search?title=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let data = await response.json();
      setTasks(data.data); // Assuming the response has a `data` field with the tasks
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setTasks([]);
  };

  // Calculate total and completed tasks
  const totalTasks = data?.length;
  const completedTasks = data?.filter((task) => task?.isCompleted).length;

  // Calculate progress percentage (Completed Tasks / Total Tasks * 100)
  const progressValue =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  return (
    <div className="w-full  max-w-[900px] h-[100vh] flex items-center justify-start pt-4 flex-col gap-4 mx-auto border-none outline-none">
      <div className="flex items-center justify-between gap-4 border w-full border-gray-300 rounded-md px-4 py-2">
        {debouncedQuery && (
          <FaArrowLeft
            className="cursor-pointer active:scale:90 transition-all duration-300"
            onClick={handleClearSearch}
          />
        )}
        <input
          type="text"
          className="outline-none border-none w-full"
          placeholder="Search for a task"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
        <CiSearch className="text-gray-700 text-xl" />
      </div>

      {debouncedQuery && (
        <div className="w-full  h-[90vh] mt-16 flex flex-col gap-4 overflow-auto p-4 absolute top-0 left-0 bg-white z-10">
          {tasks?.map((task) => (
            <div
              key={task?._id}
              className="flex items-center justify-between p-3 border-b border-gray-300 w-full"
            >
              <div className="flex items-center relative">
                <input
                  type="checkbox"
                  checked={task?.isCompleted}
                  className="mr-2 cursor-pointer"
                  onChange={() => {
                    handleTaskCompleted(task?._id);
                  }}
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
          ))}
        </div>
      )}

      <div className="grid grid-cols-7 gap-0 w-full">
        {daysInWeek?.map(({ date, day }) => (
          <div
            key={date}
            className={`flex flex-col items-center p-4 rounded-md cursor-pointer group transition-colors duration-300 ${
              date === currentDate
                ? "bg-blue-500 text-white" // Highlight style for today
                : "hover:bg-blue-500 hover:text-white" // Default hover style for other days
            }`}
          >
            <span
              className={`text-[11px] ${
                date !== currentDate ? "text-gray-400" : "text-white"
              } group-hover:text-white  `}
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
      <div className="mt-0 w-full flex flex-col gap-4 max-h-[200px] overflow-y-scroll">
        {data?.map((task) => (
          <div
            key={task.id}
            className="w-full flex items-center justify-between p-3 border-b-2 border-gray-300"
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

            {/* Priority div
            <div
              className={`px-3 py-1 rounded-full w-full text-center text-white font-semibold ${
                task?.priority === "LOW"
                  ? "bg-green-500"
                  : task?.priority?.toUpperCase() === "MEDIUM"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {task?.priority}
            </div> */}

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
