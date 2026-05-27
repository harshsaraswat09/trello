import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  register,
  login,
  getMe,
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.get("/me", authMiddleware, getMe);

export default router;
