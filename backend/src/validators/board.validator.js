import { body, param } from "express-validator";

const objectId = /^[0-9a-fA-F]{24}$/;

export const workspaceIdParamValidator = [
  param("workspaceId").matches(objectId).withMessage("Valid workspace id is required"),
];

export const boardIdParamValidator = [
  param("id").matches(objectId).withMessage("Valid board id is required"),
];

export const createBoardValidator = [
  ...workspaceIdParamValidator,
  body("title").trim().notEmpty().withMessage("Board title is required"),
  body("visibility")
    .optional()
    .isIn(["private", "workspace", "public"])
    .withMessage("Invalid board visibility"),
];

export const updateBoardValidator = [
  ...boardIdParamValidator,
  body("title").optional().trim().notEmpty().withMessage("Board title cannot be empty"),
  body("visibility")
    .optional()
    .isIn(["private", "workspace", "public"])
    .withMessage("Invalid board visibility"),
];
