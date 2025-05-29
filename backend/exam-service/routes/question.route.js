import express from "express";
const router = express.Router({ mergeParams: true });

import questionController from "../controllers/question.controller.js";

router.get("/", questionController.getAllQuestions);
router.get("/:id", questionController.getQuestionById);

export default router;
export { router as questionRoutes };
