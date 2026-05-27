import { validationResult } from "express-validator";
import { cardService } from "../services/card.service.js";

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return false;
  }
  return true;
};

export const getCards = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await cardService.listByList(req.params.listId, req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createCard = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await cardService.create(req.params.listId, req.user._id, req.body);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCardById = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await cardService.getById(req.params.id, req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateCard = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await cardService.update(req.params.id, req.user._id, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await cardService.remove(req.params.id, req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const moveCard = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await cardService.move(req.params.id, req.user._id, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const assignCard = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await cardService.assign(req.params.id, req.user._id, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateCardLabels = async (req, res, next) => {
  try {
    if (!handleValidation(req, res)) return;
    const data = await cardService.updateLabels(req.params.id, req.user._id, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
