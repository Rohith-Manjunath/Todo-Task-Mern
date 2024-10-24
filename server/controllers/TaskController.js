const Task = require("../models/TaskSchema");

//Home
const Home = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Task Manager API",
  });
};

const createTask = async (req, res) => {
  try {
    const { title, description, date, priority } = req.body;

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
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Fetch single task
const getTaskById = async (req, res) => {
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
const updateTask = async (req, res) => {
  try {
    const { title, description, date, priority } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.title = title;
    task.description = description;
    task.date = date;
    task.priority = priority;
    await task.save();
    res
      .status(200)
      .json({ success: true, message: "Task updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    await Task.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Handle isCompleted
const isCompleted = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.isCompleted = !task.isCompleted;
    await task.save();
    res.status(200).json({
      success: true,
      message: "Task status updated",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  Home,
  isCompleted,
  getTaskById,
};
