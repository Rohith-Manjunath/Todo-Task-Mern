const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  Home,
  isCompleted,
  getTaskById,
  searchTasks,
} = require("../controllers/taskController");
const router = express.Router();

router.get("/", Home);
router.post("/tasks", createTask);
router.get("/tasks", getTasks);
router.get("/tasks/search", searchTasks); // <-- Route for searching
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);
router.put("/task/:id", isCompleted);
router.get("/tasks/:id", getTaskById);

module.exports = router;
