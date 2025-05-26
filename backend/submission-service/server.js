const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB and Start
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

// 404
app.use((req, res) => {
  res.status(404).json({ message: "404 | Route not found" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`📦 Submission Service running at http://localhost:${PORT}`);
});
