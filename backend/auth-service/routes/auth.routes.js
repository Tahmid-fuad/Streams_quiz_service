import express from "express";
const router = express.Router();

import {
  registerUser,
  loginUser,
  authenticateUser,
  getUserProfile,
  getUserRole,
  switchUserRole,
  updateEmail,
  changeUserPassword,
  getAllUsers,
} from "../controllers/auth.controller.js";

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/auth", authenticateUser); // Authentication route
router.get("/profile", getUserProfile); // Profile route
router.get("/role", getUserRole);
router.patch("/switch_role", switchUserRole);
router.patch("/change_email", updateEmail);
router.patch("/change_password", changeUserPassword);
router.get("/users", getAllUsers);

export default router;
