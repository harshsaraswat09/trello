import { validationResult } from "express-validator";
import { commentService } from "../services/comment.service.js";

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return false;
  }
  return true;
};

export const getComments = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await commentService.listByCard(req.params.cardId, req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await commentService.create(req.params.cardId, req.user._id, req.body);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await commentService.update(req.params.id, req.user._id, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await commentService.remove(req.params.id, req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
