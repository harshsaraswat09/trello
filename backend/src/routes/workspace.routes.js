import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getWorkspaces,
  createWorkspace,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  inviteWorkspaceMember,
} from "../controllers/workspace.controller.js";
import {
  createWorkspaceValidator,
  workspaceIdParamValidator,
  updateWorkspaceValidator,
  inviteWorkspaceValidator,
} from "../validators/workspace.validator.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getWorkspaces);
router.post("/", createWorkspaceValidator, createWorkspace);
router.get("/:id", workspaceIdParamValidator, getWorkspaceById);
router.patch("/:id", updateWorkspaceValidator, updateWorkspace);
router.delete("/:id", workspaceIdParamValidator, deleteWorkspace);
router.post("/:id/invite", inviteWorkspaceValidator, inviteWorkspaceMember);

export default router;
