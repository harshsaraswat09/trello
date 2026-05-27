import { validationResult } from "express-validator";
import { boardService } from "../services/board.service.js";

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return false;
  }
  return true;
};

export const getBoards = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await boardService.listByWorkspace(req.params.workspaceId, req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createBoard = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await boardService.create(req.params.workspaceId, req.user._id, req.body);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getBoardById = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await boardService.getById(req.params.id, req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateBoard = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await boardService.update(req.params.id, req.user._id, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteBoard = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await boardService.remove(req.params.id, req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
