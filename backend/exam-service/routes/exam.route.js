import express from "express";
import examController from "../controllers/exam.controller.js";
const router = express.Router();

router.get("/", examController.getAllExams);
router.get("/:id", examController.getExamById);
router.post("/", examController.createExam);
router.put("/:id", examController.updateExam);
router.delete("/:id", examController.deleteExam);

// => Question routes
import questionRoutes from "./question.route.js";
router.use("/:examId/questions", questionRoutes);

export default router;
export { router as examRoutes };
