import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "./../models/user.model.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if the username already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).send("Email already in use.");
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate OTP
    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp: {
        value: otpValue,
        expiresIn: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiration
        verified: false, // Initially not verified
      },
    });
    await user.save();
    res.status(201).send("Success! User Registered.");
  } catch (error) {
    res.status(400).send("Error registering user");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by username
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).send("Username does not exist.");
    }

    // Check password
    const passMatched = await bcrypt.compare(password, user.password);
    if (!passMatched) {
      return res.status(401).send("Password doesn not match");
    }

    // Generate JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // console.log("Token generated:", token);
    res.json({ token: token });
  } catch (error) {
    console.error(`Error logging in: `, error);
    res.status(500).send("Internal server error");
  }
};

const forgotPassword = async (req, res) => {};

const resetPassword = async (req, res) => {};

const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the email is valid
    if (!email || !email.includes("@")) {
      return res.status(400).send("Invalid email address");
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
  } catch (error) {
    res.status(500).send("Error sending OTP");
  }
};

const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  try {
    // Check if the email and OTP are valid
    if (!email || !otp) {
      return res.status(400).send("Email and OTP are required");
    }

    // Verify OTP logic here (e.g., check against a database or cache)
    // For now, we will assume OTP verification is successful
    res.status(200).send("Email verified successfully");
  } catch (error) {
    res.status(500).send("Error verifying email");
  }
};

export { login, register, forgotPassword, resetPassword };
export default { login, register, forgotPassword, resetPassword };
