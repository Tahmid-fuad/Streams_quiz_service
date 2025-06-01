const express = require("express");
const router = express.Router();
const controller = require("../controllers");


router.get("/user/:userId", controller.getUserSubmissions);

module.exports = router;
