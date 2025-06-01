import express from "express";
const router = express.Router();
import controller from "../controllers/submission.controller.js";

router.post("/:examId", controller.submitExam);

export default router;
export { router as submissionRoutes };
