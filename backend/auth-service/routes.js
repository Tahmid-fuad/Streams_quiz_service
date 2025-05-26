const express = require("express");
const router = express.Router();

const { loginUser, registerUser, getUserProfile } = require("./controllers");

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getUserProfile); // Profile route

module.exports = router;

