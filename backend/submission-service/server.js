const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
dotenv.config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));


const connectDB = require("./db");
connectDB();

const submissionRoutes = require("./routes");
app.use("/api/submissions", submissionRoutes);

// Root and health check
app.get("/", (req, res) => {
  res.send("Submission Service is running");
});


app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "submission-service" });
});

// Add this before the 404 handler
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: err.response?.data || err.toString()
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "404 | Route not found" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`📦 Submission Service running at http://localhost:${PORT}`);
});
