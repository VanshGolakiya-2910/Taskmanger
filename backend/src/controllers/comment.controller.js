import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cache } from "../config/redis.js";
import {
  createCommentService,
  getTaskCommentsService,
} from "../services/comment.service.js";
import { validateCreateComment } from "../validators/comment.validator.js";

const commentsKey = (taskId) => `comments:task:${taskId}`;

/* -------------------- ADD COMMENT -------------------- */

export const addComment = asyncHandler(async (req, res) => {
  validateCreateComment(req.body);

  const comment = await createCommentService({
    user: req.user,
    taskId: req.params.taskId,
    content: req.body.content,
  });

  try {
    await cache.del(commentsKey(req.params.taskId));
  } catch (err) {
    console.error("[cache] addComment invalidate failed", err);
  }

  res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added"));
});

/* -------------------- GET TASK COMMENTS -------------------- */

export const getTaskComments = asyncHandler(async (req, res) => {
  const cacheKey = commentsKey(req.params.taskId);

  try {
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res
        .status(200)
        .json(new ApiResponse(200, cached, "Comments fetched (cache)"));
    }
  } catch (err) {
    console.error("[cache] getTaskComments read failed", err);
  }

  const comments = await getTaskCommentsService({
    user: req.user,
    taskId: req.params.taskId,
  });

  try {
    await cache.set(cacheKey, comments, 60);
  } catch (err) {
    console.error("[cache] getTaskComments write failed", err);
  }

  res.set("X-Cache", "MISS");

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched"));
});
