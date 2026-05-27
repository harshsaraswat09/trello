import { body, param } from "express-validator";

const objectId = /^[0-9a-fA-F]{24}$/;

export const cardIdParamValidator = [
  param("cardId").matches(objectId).withMessage("Valid card id is required"),
];

export const commentIdParamValidator = [
  param("id").matches(objectId).withMessage("Valid comment id is required"),
];

export const createCommentValidator = [
  ...cardIdParamValidator,
  body("content").trim().notEmpty().withMessage("Comment content is required"),
];

export const updateCommentValidator = [
  ...commentIdParamValidator,
  body("content").trim().notEmpty().withMessage("Comment content cannot be empty"),
];
