import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);

//forgot password
router.post("/forgot-password", authController.forgotPassword);

// reset password
router.post("/reset-password", authController.resetPassword);

//

export default router;
