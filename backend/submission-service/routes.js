const express = require("express");
const router = express.Router();
const controller = require("./controllers");

router.post("/:examId", controller.submitExam);
router.get("/user/:userId", controller.getUserSubmissions);

module.exports = router;
