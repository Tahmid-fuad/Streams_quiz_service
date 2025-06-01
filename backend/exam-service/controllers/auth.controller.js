import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "./../models/user.model.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the email is valid
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check if the username already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email already in use." });
    }

    // Password validation: length: 8, at least one uppercase, one lowercase, one number, and one special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    // generate OTP
    const otpValue = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP

    // Create a new user with the hashed password and OTP
    const user = new User({
      name,
      email,
      password,
      otp: {
        value: otpValue,
        expiresIn: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiration
      },
    });
    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error registering user!", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    // Check if the email is valid
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Find user by email and select password field
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email is not registered." });
    }

    // Check password
    const passMatched = await user.comparePassword(password);
    if (!passMatched) {
      return res.status(401).json({ message: "Password does not match" });
    }

    // Generate JWT
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error Loggin in!", error: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params; // req.user._id
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while fetching user profile",
      error: error.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate email format
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check if the email is already in use by another user
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.json({ message: "User profile updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while updating user profile",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while deleting user",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while fetching all users",
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {};
const changePassword = async (req, res) => {};

const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the email is valid
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  try {
    // Check if the email and OTP are valid
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Verify OTP logic here (e.g., check against a database or cache)
    // For now, we will assume OTP verification is successful
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying email", error: error.message });
  }
};

export {
  login,
  register,
  forgotPassword,
  changePassword,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers,
  sendOTP,
  verifyEmail,
};
export default {
  login,
  register,
  forgotPassword,
  changePassword,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers,
  sendOTP,
  verifyEmail,
};
