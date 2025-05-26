const express = require("express");
const app = express();

// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const examRoutes = require("./routes");
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
const connectDB = require("./db");
connectDB();

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Exam Service is running on http://localhost:${PORT}`);
});
