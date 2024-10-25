const Task = require("../models/TaskSchema");

//Home
exports.Home = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Task Manager API",
  });
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, date, priority } = req.body;

    // Parse the date from the request (assumed to be in 'YYYY-MM-DD' format)
    const taskDate = new Date(date + "T00:00:00"); // Append time to create a valid Date object

    // Get today's date and set the time to midnight for accurate comparisons
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight

    // Calculate the start of the current week (Monday) and the end of the week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)
    ); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

    // Validate that the task date is today or in the future and within the current week
    if (taskDate < today || taskDate > endOfWeek) {
      return res.status(400).json({
        success: false,
        message:
          "You can only create tasks for today or future dates within the current week.",
      });
    }

    // Creating a new task using the request body data
    const task = await Task.create({
      title,
      description,
      date,
      priority,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Fetch single task
exports.getTaskById = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, date, priority } = req.body;

    // Parse the date from the request (assumed to be in 'YYYY-MM-DD' format)
    const taskDate = new Date(date + "T00:00:00"); // Append time to create a valid Date object

    // Get today's date and set the time to midnight for accurate comparisons
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight

    // Calculate the start of the current week (Monday) and the end of the week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)
    ); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

    // Validate that the task date is today or in the future and within the current week
    if (taskDate < today || taskDate > endOfWeek) {
      return res.status(400).json({
        success: false,
        message:
          "You can only update tasks for today or future dates within the current week.",
      });
    }

    // Find the task by ID
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update task properties
    task.title = title;
    task.description = description;
    task.date = date;
    task.priority = priority;

    // Save updated task
    await task.save();

    res
      .status(200)
      .json({ success: true, message: "Task updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    await Task.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Handle isCompleted
exports.isCompleted = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Toggle the isCompleted flag and update the status
    task.isCompleted = !task.isCompleted;
    task.status = task.isCompleted ? "Completed" : "In Progress"; // Update status based on isCompleted

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task status updated",
      task, // Optionally return the updated task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search tasks by title
exports.searchTasks = async (req, res) => {
  try {
    const searchQuery = req.query.title; // Extract search query from URL parameters
    console.log("searchQuery", req.query);

    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query",
      });
    }

    // Using a regular expression for case-insensitive search
    const tasks = await Task.find({
      title: { $regex: searchQuery, $options: "i" },
    });

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tasks found matching your search",
      });
    }

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.filterTasksByDate = async (req, res) => {
  try {
    const dateQuery = req.query.date; // Extract date query from URL parameters
    if (!dateQuery) {
      return res.status(400).json({
        success: false,
        message: "Please provide a date in DD/MM/YYYY format",
      });
    }

    // Split the dateQuery into day, month, year
    const [day, month, year] = dateQuery.split("/").map(Number);

    // Create a Date object from the parsed values (note: month is 0-indexed)
    const taskDate = new Date(year, month - 1, day); // month - 1 because JS months are 0-indexed

    // Fetch tasks matching the specific date
    const tasks = await Task.find({
      date: {
        $gte: taskDate.setHours(0, 0, 0, 0), // Start of the day
        $lt: taskDate.setHours(23, 59, 59, 999), // End of the day
      },
    });

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tasks found for the specified date",
      });
    }

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
