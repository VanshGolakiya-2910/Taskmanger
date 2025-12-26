import {
  createTaskService,
  updateTaskStatusService,
  deleteTaskService,
} from "../services/task.service.js";
import {
  validateCreateTask,
  validateStatusUpdate,
} from "../validators/task.validator.js";

export const createTask = async (req, res) => {
  try {
    validateCreateTask(req.body);

    const task = await createTaskService(req.user, req.body);
    res.status(201).json(task);
  } catch (err) {
    if (err.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.status(400).json({ message: "Task creation failed" });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    validateStatusUpdate(req.body);

    await updateTaskStatusService(
      req.user,
      req.params.taskId,
      req.body.status
    );

    res.status(200).json({ message: "Status updated" });
  } catch (err) {
    if (["FORBIDDEN", "INVALID_TRANSITION"].includes(err.message)) {
      return res.status(403).json({ message: err.message });
    }
    res.status(404).json({ message: "Task not found" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await deleteTaskService(req.user, req.params.taskId);
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(403).json({ message: "Forbidden" });
  }
};
