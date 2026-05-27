import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getLists,
  createList,
  updateList,
  deleteList,
  reorderList,
} from "../controllers/list.controller.js";
import {
  boardIdParamValidator,
  createListValidator,
  updateListValidator,
  listIdParamValidator,
  reorderListValidator,
} from "../validators/list.validator.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/boards/:boardId/lists", boardIdParamValidator, getLists);
router.post("/boards/:boardId/lists", createListValidator, createList);
router.patch("/lists/:id", updateListValidator, updateList);
router.delete("/lists/:id", listIdParamValidator, deleteList);
router.patch("/lists/:id/reorder", reorderListValidator, reorderList);

export default router;
