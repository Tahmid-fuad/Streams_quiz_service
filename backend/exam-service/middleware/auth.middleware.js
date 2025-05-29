import User from "../models/user.model.js";

import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  if (req.user) {
    try {
      req.user = await User.findById(decoded._id).select("-password");
      if (!req.user) {
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
  } else {
    res
      .status(401)
      .json({ message: "Unauthorized Access Request, No token found." });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === "admin") {
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
