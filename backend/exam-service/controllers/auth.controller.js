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
    const user = new User({
      name,
      email,
      password: hashedPassword,
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

export { login, register, forgotPassword, resetPassword };
export default { login, register, forgotPassword, resetPassword };
