import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "./../models/user.model.js";

const registerUser = async (req, res) => {
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

const loginUser = async (req, res) => {
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

const authenticateUser = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res
      .status(200)
      .json({ message: "Authentication successful", user: decoded });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};

// Get user profile by ID
const getUserProfile = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract email from token
    const userEmail = decoded.email;

    // Find user by email
    const user = await User.findOne({ email: userEmail }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send profile response
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};

// Get user role from token
const getUserRole = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Return the user's role and email
    return res.status(200).json({
      role: decoded.role,
      email: decoded.email, // Assuming 'email' is in the token payload
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token", error: error.message });
  }
};

const switchUserRole = async (req, res) => {
  const { email, newRole } = req.body;

  if (!email || !newRole || !["admin", "student"].includes(newRole)) {
    return res.status(400).json({ message: "Invalid email or role" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { role: newRole },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `Role updated successfully to ${user.role}`,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating role", error: error.message });
  }
};

const updateEmail = async (req, res) => {
  const { email, newEmail } = req.body;

  if (!email || !newEmail) {
    return res
      .status(400)
      .json({ message: "Email and new email are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (newEmail === user.email) {
      return res
        .status(400)
        .json({ message: "You are already using this email" });
    }

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ message: "This email is already taken" });
    }

    user.email = newEmail;
    await user.save();

    res.status(200).json({
      message: "Email updated successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating email", error: error.message });
  }
};

const changeUserPassword = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new passwords are required" });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }
    user.password = newPassword;

    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

// Get all users (admin access only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role"); // fetch only these fields
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

export default {
  registerUser,
  loginUser,
  authenticateUser,
  getUserProfile,
  getUserRole,
  switchUserRole,
  updateEmail,
  changeUserPassword,
  getAllUsers,
};

export {
  registerUser,
  loginUser,
  authenticateUser,
  getUserProfile,
  getUserRole,
  switchUserRole,
  updateEmail,
  changeUserPassword,
  getAllUsers,
};
