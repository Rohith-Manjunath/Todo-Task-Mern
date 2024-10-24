const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  Home,
} = require("../controllers/taskController");
const router = express.Router();

router.get("/", Home);
router.post("/tasks", createTask);
router.get("/tasks", getTasks);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

module.exports = router;
