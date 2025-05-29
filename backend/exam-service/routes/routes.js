import express from "express";

// # Import routes
import authRoutes from "./auth.route.js";
import examAdminRoutes from "./exam.admin.route.js";
import examRoutes from "./exam.route.js";

import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

// => Authentication routes
router.use("/api/auth", authRoutes);

// => Exam routes
router.use("/api/admin/exams", isAuthenticated, examAdminRoutes);
router.use("/api/exams", examRoutes);

// => Base Route
router.get("/", (req, res) => {
  res.send("Exam Service is running");
});

export default router;
