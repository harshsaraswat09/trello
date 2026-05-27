import { validationResult } from "express-validator";
import { listService } from "../services/list.service.js";

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return false;
  }
  return true;
};

export const getLists = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await listService.listByBoard(req.params.boardId, req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createList = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await listService.create(req.params.boardId, req.user._id, req.body);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateList = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await listService.update(req.params.id, req.user._id, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteList = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await listService.remove(req.params.id, req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const reorderList = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await listService.reorder(req.params.id, req.user._id, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
