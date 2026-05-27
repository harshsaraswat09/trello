import { body, param } from "express-validator";

const objectId = /^[0-9a-fA-F]{24}$/;

export const boardIdParamValidator = [
  param("boardId").matches(objectId).withMessage("Valid board id is required"),
];

export const listIdParamValidator = [
  param("id").matches(objectId).withMessage("Valid list id is required"),
];

export const createListValidator = [
  ...boardIdParamValidator,
  body("title").trim().notEmpty().withMessage("List title is required"),
];

export const updateListValidator = [
  ...listIdParamValidator,
  body("title").optional().trim().notEmpty().withMessage("List title cannot be empty"),
];

export const reorderListValidator = [
  ...listIdParamValidator,
  body("previousId").optional({ nullable: true }).matches(objectId).withMessage("previousId must be a valid id"),
  body("nextId").optional({ nullable: true }).matches(objectId).withMessage("nextId must be a valid id"),
];
