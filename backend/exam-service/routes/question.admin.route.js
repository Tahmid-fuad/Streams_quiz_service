import express from "express";
const router = express.Router({ mergeParams: true });

import questionController from "../controllers/question.controller.js";

router.get("/", questionController.getAllQuestions);
router.get("/:id", questionController.getQuestionById);
router.post("/", questionController.createQuestion);
router.post("/bulk", questionController.createMultipleQuestions);
router.put("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestion);

export default router;
export { router as questionRoutes };
