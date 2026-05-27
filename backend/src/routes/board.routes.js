import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getBoards,
  createBoard,
  getBoardById,
  updateBoard,
  deleteBoard,
} from "../controllers/board.controller.js";
import {
  workspaceIdParamValidator,
  createBoardValidator,
  boardIdParamValidator,
  updateBoardValidator,
} from "../validators/board.validator.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/workspaces/:workspaceId/boards", workspaceIdParamValidator, getBoards);
router.post("/workspaces/:workspaceId/boards", createBoardValidator, createBoard);
router.get("/boards/:id", boardIdParamValidator, getBoardById);
router.patch("/boards/:id", updateBoardValidator, updateBoard);
router.delete("/boards/:id", boardIdParamValidator, deleteBoard);

export default router;
