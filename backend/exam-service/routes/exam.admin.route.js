import express from "express";
import examController from "../controllers/exam.controller.js";
// import { isAuthenticated } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", examController.getAllExamsWithAnswers);
router.get("/:id", examController.getExamByIdWithAnswers);
router.post("/", examController.createExam);
router.put("/:id", examController.updateExam);
router.delete("/:id", examController.deleteExam);

// => Question routes
import questionRoutes from "./question.admin.route.js";
router.use("/:examId/questions", questionRoutes);

export default router;
export { router as examAdminRoutes };
