const express = require("express");
const cors = require("cors"); // Import cors
const app = express();

// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

const FRONT_END= process.env.FRONT_END_URL

// Enable CORS for frontend at http://localhost:5173
app.use(cors({
  origin: `http://localhost:${FRONT_END}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true 
}));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require("./routes");
app.use("/api/users", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Authorization Service is running");
});

// Simple health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "auth-service" });
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
  console.log(`Authorization Service is running on http://localhost:${PORT}`);
});