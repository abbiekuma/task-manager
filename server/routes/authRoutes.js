// server/routes/authRoutes.js
import express from "express";
import { Router } from "express";
import AuthController from "../controllers/authController.js";

const router = express.Router();
router.post("/register", AuthController.registerUser);

export default router;
