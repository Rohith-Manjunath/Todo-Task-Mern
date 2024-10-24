const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Please provide title"] },
  description: { type: String },
  date: { type: Date, required: [true, "Please provide date"] },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  status: {
    type: String,
    enum: ["In Progress", "Completed"],
    default: "In Progress",
  },
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
