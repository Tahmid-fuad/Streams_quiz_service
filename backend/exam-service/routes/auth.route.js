import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);

// Get user profile
router.get("/:id/profile", authController.getUserProfile);

// Get all users
router.get("/users", authController.getAllUsers);

// Update user profile
router.put("/profile", authController.updateUserProfile);

// Delete user
router.delete("/:id", authController.deleteUser);

//forgot password
router.post("/forgot-password", authController.forgotPassword);

// reset password
router.post("/change-password", authController.changePassword);

export default router;
