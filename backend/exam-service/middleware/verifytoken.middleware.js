import jwt from "jsonwebtoken";
const decodeToken = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      res
        .status(401)
        .json({ message: "Unauthorized Access Request, token failed." });
    }
  }
  next();
};

const isAuthenticated = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
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

export default decodeToken;
