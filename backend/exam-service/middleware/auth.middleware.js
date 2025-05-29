import User from "../models/user.model.js";

import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded._id).select("-password");
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
