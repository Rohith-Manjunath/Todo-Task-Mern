import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
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
import dayjs from "dayjs";
import SearchBar from "../components/SearchBar";
import SearchQueryTasks from "../components/SearchQueryTasks";
import DaysInWeeksContainer from "../components/DaysInWeeksContainer";
import TasksContainer from "../components/TasksContainer";
import TaskList from "../components/TaskList";
import DrawerForEditAndCreate from "../components/DrawerForEditAndCreate";
import ProgressBar from "../components/ProgressBar";
import { getWeekDates } from "../helper/getWeeks";

const daysInWeek = getWeekDates();
// Get the current date
const today = new Date();
const currentDate = today.getDate();

const Home = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState(dayjs()); // Initialize with current date using dayjs
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const { data, isLoading } = useGetTasksQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteTask] = useDeleteTaskMutation();
  const [taskComplete] = useIsTaskCompletedMutation();
  const [udpateTask, { isLoading: updateLoading }] = useUpdateTaskMutation();
  const [id, setId] = useState("");
  const [createTask, { isLoading: createLoading }] = useCreateTaskMutation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const handleDeleteTask = async (id) => {
    try {
      const data = await deleteTask({ id }).unwrap();
      toast({
        description: data?.message,
        className: "bg-green-500 text-white font-semibold tracking-wide",
      });
      if (debouncedQuery) {
        getData(debouncedQuery);
      }
    } catch (e) {
      toast({
        description: e?.data?.message,
        className: "bg-red-500 text-white font-semibold tracking-wide",
      });
    }
  };

  const handleTaskCompleted = async (id) => {
    try {
      const data = await taskComplete({ id }).unwrap();
      toast({
        description: data?.message,
        className: "bg-green-500 text-white font-semibold tracking-wide",
      });
      if (debouncedQuery) {
        getData(debouncedQuery);
      }
    } catch (e) {
      toast({
        description: e?.data?.message,
        className: "bg-red-500 text-white font-semibold tracking-wide",
      });
    }
  };

  const handleCreateTask = async () => {
    try {
      const formattedDate = dayjs(taskDate).format("YYYY-MM-DD"); // Format date before sending
      const data = await createTask({
        priority: taskPriority,
        date: formattedDate,
        description: taskDescription,
        title: taskTitle,
      }).unwrap();
      toast({
        description: data?.message,
        className: "bg-green-500 text-white font-semibold tracking-wide",
      });
      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("");
      setTaskDate(dayjs()); // Reset to current date
      setDrawerOpen(false);
    } catch (e) {
      toast({
        description: e?.data?.message,
        className: "bg-red-500 text-white font-semibold tracking-wide",
      });
    }
  };

  const handleEdit = (task) => {
    console.log(task.priority);
    setId(task._id);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskPriority(task.priority);

    // Convert the task date to a Day.js object
    const formattedDate = dayjs(task.date).format("YYYY-MM-DD"); // Format to YYYY-MM-DD
    setTaskDate(formattedDate); // Set the formatted date for the input
    setIsEditing(true);
    setDrawerOpen(true);
  };

  const handleUpdateTask = async (id) => {
    try {
      const formattedDate = dayjs(taskDate).format("YYYY-MM-DD"); // Format date before sending
      const data = await udpateTask({
        data: {
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority,
          date: formattedDate,
        },
        id,
      }).unwrap();

      toast({
        description: data?.message,
        className: "bg-green-500 text-white font-semibold tracking-wide",
      });
      if (debouncedQuery) {
        getData(debouncedQuery);
      }
      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("");
      setTaskDate(dayjs()); // Reset to current date
      setIsEditing(false);
      setDrawerOpen(false);
      setId("");
    } catch (e) {
      toast({
        description: e?.data?.message,
        className: "bg-red-500 text-white font-semibold tracking-wide",
      });
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery) {
      getData(debouncedQuery);
    }
  }, [debouncedQuery]);

  const getData = async (query) => {
    try {
      setSearchLoading(true);
      let response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks/search?title=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let data = await response.json();
      setTasks(data?.data);
      setSearchLoading(false);
    } catch (error) {
      setSearchLoading(false);
      console.error("Error fetching tasks:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setTasks([]);
  };

  const totalTasks = data?.length;
  const completedTasks = data?.filter((task) => task?.isCompleted).length;
  const progressValue =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  return (
    <>
      <div className="w-full  max-w-[900px] h-[100vh] flex items-center justify-start pt-4 flex-col gap-4 mx-auto border-none outline-none">
        <SearchBar
          FaArrowLeft={FaArrowLeft}
          debouncedQuery={debouncedQuery}
          handleClearSearch={handleClearSearch}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          CiSearch={CiSearch}
        />

        {debouncedQuery && (
          <SearchQueryTasks
            tasks={tasks}
            handleTaskCompleted={handleTaskCompleted}
            RiDeleteBin6Line={RiDeleteBin6Line}
            handleEdit={handleEdit}
            handleDeleteTask={handleDeleteTask}
            FaEdit={FaEdit}
            isLoading={searchLoading}
          />
        )}
        <DaysInWeeksContainer
          daysInWeek={daysInWeek}
          currentDate={currentDate}
        />
        {/* Task Containers */}

        <TasksContainer data={data} />

        <div className="flex items-start justify-center flex-col gap-3 w-[90%] lg:w-full">
          <h4 className="font-semibold text-lg">Weekly Progress</h4>
          <ProgressBar progress={progressValue} />
        </div>

        <div className="w-[90%] lg:w-full flex items-center justify-center gap-4">
          <div className="w-full flex items-center justify-between">
            <h5 className="font-semibold text-lg">Tasks</h5>
            <span className="text-[13px] text-blue-500">View All</span>
          </div>
        </div>

        {/* Task List */}
        <TaskList
          FaEdit={FaEdit}
          RiDeleteBin6Line={RiDeleteBin6Line}
          data={data}
          handleDeleteTask={handleDeleteTask}
          handleEdit={handleEdit}
          handleTaskCompleted={handleTaskCompleted}
          isLoading={isLoading}
        />

        {/* Floating Action Button */}
        <div
          className="w-14 h-14 hover:cursor-pointer rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center"
          onClick={() => {
            setDrawerOpen(true);
            setTaskTitle("");
            setTaskDescription("");
            setTaskPriority("");
            setTaskDate(dayjs()); // Reset to current date
            setIsEditing(false);
          }}
        >
          <span className="text-3xl">+</span>
        </div>

        {/* Drawer Component */}
        <DrawerForEditAndCreate
          isDrawerOpen={isDrawerOpen}
          setDrawerOpen={setDrawerOpen}
          isEditing={isEditing}
          taskTitle={taskTitle}
          setTaskTitle={setTaskTitle}
          taskPriority={taskPriority}
          setTaskPriority={setTaskPriority}
          taskDate={taskDate}
          setTaskDate={setTaskDate}
          taskDescription={taskDescription}
          setTaskDescription={setTaskDescription}
          handleCreateTask={handleCreateTask}
          handleUpdateTask={handleUpdateTask}
          id={id}
          createLoading={createLoading}
          updateLoading={updateLoading}
        />
      </div>
    </>
  );
};

export default Home;
