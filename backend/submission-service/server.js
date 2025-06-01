const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./db");
const submissionUserRoutes = require("./routes/user.routes");
const submissionAdminRoutes = require("./routes/admin.routes");


const app = express();
dotenv.config();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Root and health check
app.get("/", (req, res) => {
  res.send("Submission Service is running");
});


app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "submission-service" });
});


app.use("/api/submissions", submissionUserRoutes);
app.use("/api/admin/submissions", submissionAdminRoutes);


const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log( `📦 Submission Service running at http://localhost:${PORT}`);
});