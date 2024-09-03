const Task = require("../models/Task");
const User = require("../models/User");
const taskRouter = require("express").Router();

// Get all tasks
taskRouter.get("/list", async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo");
    res.send(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// count task
taskRouter.get("/count", async (req, res) => {
  try {
    const taskCount = await Task.countDocuments({});
    res.status(200).json({ count: taskCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get single task by id
taskRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id).exec();
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.status(200).send(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Create a new task
taskRouter.post("/add", async (req, res) => {
  const { name, progress, deadline } = req.body;
  const assignedTo = req.body.assignedTo || [];

  try {
    const task = new Task({ name, progress: 0, deadline, assignedTo });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Edit a task
taskRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, progress, deadline, assignedTo } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      id,
      {
        name,
        progress,
        deadline,
        assignedTo,
      },
      { new: true }
    ).exec(); // Return the updated task

    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    res.status(200).send(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});
// Delete a task
taskRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Assign a task to a user
taskRouter.put("/:id/assign", async (req, res) => {
  try {
    const taskId = req.params.id;
    const { assignedTo } = req.body;

    // Validate assignedTo
    if (
      !Array.isArray(assignedTo) ||
      !assignedTo.every((id) => typeof id === "string")
    ) {
      return res.status(400).json({ error: "Invalid assignedTo format" });
    }

    // Find and update the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Update the assignedTo field
    task.assignedTo = [...new Set(assignedTo)]; // Ensure unique IDs
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = taskRouter;
