const express = require("express");
const {
  Home,
  createTask,
  getTasks,
  searchTasks,
  filterTasksByDate,
  updateTask,
  isCompleted,
  getTaskById,
  deleteTask,
} = require("../controllers/TaskController");
const router = express.Router();

router.get("/", Home);
router.post("/tasks", createTask);
router.get("/tasks", getTasks);
router.get("/tasks/search", searchTasks); // <-- Route for searching
router.get("/tasks/filter", filterTasksByDate);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);
router.put("/task/:id", isCompleted);
router.get("/tasks/:id", getTaskById);

module.exports = router;
