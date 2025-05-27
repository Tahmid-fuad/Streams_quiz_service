import express from "express";
const app = express();

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Middleware for CORS Handling
import cors from "cors";
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Adjust the origin as needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
// => Authentication routes
// import authRoutes from "./routes/auth.route.js";
// app.use("/api/auth", authRoutes);

// => Question routes
import questionRoutes from "./routes/question.route.js";
app.use("/api/questions", questionRoutes);

// Import exam routes
import examRoutes from "./routes/exam.route.js";
app.use("/api/exams", examRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Exam Service is running");
});

// Simple health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "exam-service" });
});

// Not Found handler
app.use((req, res) => {
  res.status(404).json({ message: "404 | Route not found" });
});

// Connect to the database
import connectDB from "./config/db.js";
connectDB();

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Exam Service is running on http://localhost:${PORT}`);
});
