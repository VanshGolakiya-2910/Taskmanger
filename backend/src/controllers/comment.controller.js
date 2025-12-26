import {
  createCommentService,
  getTaskCommentsService,
} from "../services/comment.service.js";
import { validateCreateComment } from "../validators/comment.validator.js";

export const addComment = async (req, res) => {
  try {
    validateCreateComment(req.body);

    const comment = await createCommentService({
      user: req.user,
      taskId: req.params.taskId,
      content: req.body.content,
    });

    res.status(201).json(comment);
  } catch (err) {
    if (["FORBIDDEN"].includes(err.message)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (err.message === "TASK_NOT_FOUND") {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(400).json({ message: "Failed to add comment" });
  }
};

export const getTaskComments = async (req, res) => {
  try {
    const comments = await getTaskCommentsService({
      user: req.user,
      taskId: req.params.taskId,
    });

    res.status(200).json(comments);
  } catch (err) {
    if (["FORBIDDEN"].includes(err.message)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.status(404).json({ message: "Task not found" });
  }
};
