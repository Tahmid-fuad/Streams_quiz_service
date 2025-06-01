import User from "../models/user.model.js";

import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized Access Request, No token found." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "Unauthorized Access Request, User not found" });
    }
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Unauthorized Access Request, token failed." });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Unauthorized Access Request - Not an Admin" });
  }
};

export const isSuperAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === "superadmin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Unauthorized Access Request - Not a Superadmin" });
  }
};

export const hasPermission = (permission) => {
  return (req, res, next) => {
    if (req.permissions[permission]) {
      next();
    } else {
      res
        .status(403)
        .json({ message: `Unauthorized to access: ${permission}` });
    }
  };
};
