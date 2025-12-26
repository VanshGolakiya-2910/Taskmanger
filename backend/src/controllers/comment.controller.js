import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  createCommentService,
  getTaskCommentsService,
} from "../services/comment.service.js";
import { validateCreateComment } from "../validators/comment.validator.js";

/* -------------------- ADD COMMENT -------------------- */

export const addComment = asyncHandler(async (req, res) => {
  validateCreateComment(req.body);

  const comment = await createCommentService({
    user: req.user,
    taskId: req.params.taskId,
    content: req.body.content,
  });

  res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added"));
});

/* -------------------- GET TASK COMMENTS -------------------- */

export const getTaskComments = asyncHandler(async (req, res) => {
  const comments = await getTaskCommentsService({
    user: req.user,
    taskId: req.params.taskId,
  });

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched"));
});
