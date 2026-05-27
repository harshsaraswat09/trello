import { body, param } from "express-validator";

const objectId = /^[0-9a-fA-F]{24}$/;

const labelValidator = body("labels")
  .optional()
  .isArray()
  .withMessage("labels must be an array");

export const listIdParamValidator = [
  param("listId").matches(objectId).withMessage("Valid list id is required"),
];

export const cardIdParamValidator = [
  param("id").matches(objectId).withMessage("Valid card id is required"),
];

export const createCardValidator = [
  ...listIdParamValidator,
  body("title").trim().notEmpty().withMessage("Card title is required"),
  body("description").optional().isString().withMessage("description must be a string"),
  body("dueDate").optional({ nullable: true }).isISO8601().withMessage("dueDate must be ISO date"),
  body("coverImage").optional().isString().withMessage("coverImage must be a string"),
  body("assignedUsers").optional().isArray().withMessage("assignedUsers must be an array"),
  body("assignedUsers.*").optional().matches(objectId).withMessage("assignedUsers contains invalid user id"),
  labelValidator,
  body("labels.*.text").optional().notEmpty().withMessage("label text is required"),
  body("labels.*.color").optional().notEmpty().withMessage("label color is required"),
];

export const updateCardValidator = [
  ...cardIdParamValidator,
  body("title").optional().trim().notEmpty().withMessage("Card title cannot be empty"),
  body("description").optional().isString().withMessage("description must be a string"),
  body("dueDate").optional({ nullable: true }).isISO8601().withMessage("dueDate must be ISO date"),
  body("coverImage").optional().isString().withMessage("coverImage must be a string"),
  body("assignedUsers").optional().isArray().withMessage("assignedUsers must be an array"),
  body("assignedUsers.*").optional().matches(objectId).withMessage("assignedUsers contains invalid user id"),
  labelValidator,
  body("labels.*.text").optional().notEmpty().withMessage("label text is required"),
  body("labels.*.color").optional().notEmpty().withMessage("label color is required"),
];

export const moveCardValidator = [
  ...cardIdParamValidator,
  body("listId").optional().matches(objectId).withMessage("listId must be a valid id"),
  body("previousId").optional({ nullable: true }).matches(objectId).withMessage("previousId must be valid id"),
  body("nextId").optional({ nullable: true }).matches(objectId).withMessage("nextId must be valid id"),
];

export const assignCardValidator = [
  ...cardIdParamValidator,
  body("assignedUsers").isArray().withMessage("assignedUsers must be an array"),
  body("assignedUsers.*").matches(objectId).withMessage("assignedUsers contains invalid user id"),
];

export const cardLabelsValidator = [
  ...cardIdParamValidator,
  body("labels").isArray().withMessage("labels must be an array"),
  body("labels.*.text").notEmpty().withMessage("label text is required"),
  body("labels.*.color").notEmpty().withMessage("label color is required"),
];
