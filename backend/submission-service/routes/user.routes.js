const express = require("express");
const router = express.Router();
const controller = require("../controllers");

router.post("/:examId", controller.submitExam);

module.exports = router;    
