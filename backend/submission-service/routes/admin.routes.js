import express from "express";
import controller from "../controllers/submission.controller.js";
const router = express.Router();

router.get("/user/:userId", controller.getUserSubmissions);

export default router;
export { router as adminRoutes };
