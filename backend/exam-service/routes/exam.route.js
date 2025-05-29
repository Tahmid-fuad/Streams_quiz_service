import express from "express";
import examController from "../controllers/exam.controller.js";
// import { isAuthenticated } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", examController.getAllExams);
router.get("/:id", examController.getExamById);

// => Question routes
import questionRoutes from "./question.route.js";
router.use("/:examId/questions", questionRoutes);

export default router;
export { router as examRoutes };
