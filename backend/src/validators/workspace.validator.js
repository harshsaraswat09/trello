import { body, param } from "express-validator";
import { WORKSPACE_ROLE_VALUES } from "../constants/workspace-roles.js";

const objectId = /^[0-9a-fA-F]{24}$/;

export const workspaceIdParamValidator = [
  param("id").matches(objectId).withMessage("Valid workspace id is required"),
];

export const createWorkspaceValidator = [
  body("name").trim().notEmpty().withMessage("Workspace name is required"),
];

export const updateWorkspaceValidator = [
  ...workspaceIdParamValidator,
  body("name").optional().trim().notEmpty().withMessage("Workspace name cannot be empty"),
];

export const inviteWorkspaceValidator = [
  ...workspaceIdParamValidator,
  body("email").isEmail().withMessage("Valid email is required"),
  body("role").isIn(WORKSPACE_ROLE_VALUES).withMessage("Invalid workspace role"),
];
