import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import {
  cardIdParamValidator,
  createCommentValidator,
  commentIdParamValidator,
  updateCommentValidator,
} from "../validators/comment.validator.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/cards/:cardId/comments", cardIdParamValidator, getComments);
router.post("/cards/:cardId/comments", createCommentValidator, createComment);
router.patch("/comments/:id", updateCommentValidator, updateComment);
router.delete("/comments/:id", commentIdParamValidator, deleteComment);

export default router;
