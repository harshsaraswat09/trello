import { validationResult } from "express-validator";
import { workspaceService } from "../services/workspace.service.js";

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return false;
  }
  return true;
};

export const getWorkspaces = async (req, res, next) => {
  try {
    const data = await workspaceService.listForUser(req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createWorkspace = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await workspaceService.create(req.user._id, req.body);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceById = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await workspaceService.getById(req.params.id, req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateWorkspace = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await workspaceService.update(req.params.id, req.user._id, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspace = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await workspaceService.remove(req.params.id, req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const inviteWorkspaceMember = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await workspaceService.invite(req.params.id, req.user._id, req.body);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
