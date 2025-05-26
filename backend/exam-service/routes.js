const express = require("express");
const router = express.Router();
const controllers = require("./controllers");

router.get("/", controllers.getAllExams);
router.get("/:id", controllers.getExamById);
router.post("/", controllers.createExam);
router.put("/:id", controllers.updateExam);
router.delete("/:id", controllers.deleteExam);

module.exports = router;
