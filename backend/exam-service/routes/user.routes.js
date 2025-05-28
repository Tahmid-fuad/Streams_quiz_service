import express from "express";

import userController from "../controllers/user.controller.js";

const router = express.Router();

// Get all users
router.get("/", userController.getAllUsers);

// Get user by ID
router.get("/:id", userController.getUserById);

// Create a new user
router.post("/", userController.createUser);

// Update user by ID
router.put("/:id", userController.updateUserById);

// Delete user by ID
router.delete("/:id", userController.deleteUserById);

export default router;
export { router as userRoutes };
