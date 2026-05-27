import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getCards,
  createCard,
  getCardById,
  updateCard,
  deleteCard,
  moveCard,
  assignCard,
  updateCardLabels,
} from "../controllers/card.controller.js";
import {
  listIdParamValidator,
  createCardValidator,
  cardIdParamValidator,
  updateCardValidator,
  moveCardValidator,
  assignCardValidator,
  cardLabelsValidator,
} from "../validators/card.validator.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/lists/:listId/cards", listIdParamValidator, getCards);
router.post("/lists/:listId/cards", createCardValidator, createCard);
router.get("/cards/:id", cardIdParamValidator, getCardById);
router.patch("/cards/:id", updateCardValidator, updateCard);
router.delete("/cards/:id", cardIdParamValidator, deleteCard);
router.patch("/cards/:id/move", moveCardValidator, moveCard);
router.post("/cards/:id/assign", assignCardValidator, assignCard);
router.post("/cards/:id/labels", cardLabelsValidator, updateCardLabels);

export default router;
