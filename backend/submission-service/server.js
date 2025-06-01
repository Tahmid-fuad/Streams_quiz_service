import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./configs/db.js";

// # Import Middleware
import errorMiddleware from "./middleware/error.middleware.js";
import notFoundMiddleware from "./middleware/404.middleware.js";
import loggingMiddleware from "./middleware/logging.middleware.js";

// # Load environment variables
dotenv.config();

// # Create an Express app instance
const app = express();

// => Middleware for CORS Handling
app.use(
  cors({
    origin: "*", //List of allowed origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// => Logger middleware
app.use(loggingMiddleware);

// => Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// # Import routes
import { isAuthenticated, isAdmin } from "./middleware/auth.middleware.js";
import submissionUserRoutes from "./routes/user.routes.js";
import submissionAdminRoutes from "./routes/admin.routes.js";
app.get("/", (req, res) => {
  res.send("Submission Service is running");
});

app.use("/api/submissions", isAuthenticated, submissionUserRoutes);
app.use(
  "/api/admin/submissions",
  isAuthenticated,
  isAdmin,
  submissionAdminRoutes
);

// # Miiddleware
// ! Error handling middleware
app.use(errorMiddleware);

// ! Not Found handler
app.use(notFoundMiddleware);

// # Start the server
const PORT = process.env.PORT || 3006;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Submission Service is running on http://localhost:${PORT}`);
  // # Connect to the database
  connectDB();
});
