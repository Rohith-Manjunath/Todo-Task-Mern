import SingleTaskCard from "./SingleTaskCard";

const TaskList = ({
  data,
  handleDeleteTask,
  RiDeleteBin6Line,
  handleEdit,
  handleTaskCompleted,
  FaEdit,
}) => {
  return (
    <div className="mt-0 w-[95%] sm:w-full max-h-[200px] overflow-y-scroll">
      <table className="min-w-full border-collapse">
        <tbody>
          {data?.map((task) => (
            <SingleTaskCard
              key={task?._id}
              task={task}
              handleTaskCompleted={handleTaskCompleted}
              handleDeleteTask={handleDeleteTask}
              RiDeleteBin6Line={RiDeleteBin6Line}
              FaEdit={FaEdit}
              handleEdit={handleEdit}
            />
          ))}
          {data?.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center p-3 text-gray-500">
                No tasks available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
