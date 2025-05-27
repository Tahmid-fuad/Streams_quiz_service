const express = require("express");
const router = express.Router();

const { loginUser, registerUser, getUserProfile, getUserRole,switchUserRole,changeUserName,updateEmail,changeUserPassword } = require("./controllers");

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getUserProfile); // Profile route
router.get("/role", getUserRole);
router.patch("/switch_role", switchUserRole);
router.patch("/change_name", changeUserName);
router.patch("/change_email", updateEmail);
router.patch("/change_password", changeUserPassword);

module.exports = router;

