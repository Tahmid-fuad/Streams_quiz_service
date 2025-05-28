// # Create an Express app instance
import express from "express";
const app = express();

// Logger middleware
import morgan from "morgan";
app.use(morgan("combined"));

// # Load environment variables
import dotenv from "dotenv";
dotenv.config();

// => Middleware for CORS Handling
import cors from "cors";
app.use(
  cors({
    origin: "*", // Open for all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// => Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// # Import routes
// => Authentication routes
import authRoutes from "./routes/auth.route.js";
app.use("/api/auth", authRoutes);

// => Exam routes
import examAdminRoutes from "./routes/exam.admin.route.js";
import examRoutes from "./routes/exam.route.js";
app.use("/api/admin/exams", examAdminRoutes);
app.use("/api/exams", examRoutes);

// => Base Route
app.get("/", (req, res) => {
  res.send("Exam Service is running");
});

// # Miiddleware
// ! Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// ! Not Found handler
app.use((req, res) => {
  res.status(404).json({ message: "404 | Route not found" });
});

// # Connect to the database
import connectDB from "./config/db.js";
connectDB();

// # Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Exam Service is running on http://localhost:${PORT}`);
});
