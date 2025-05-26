const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    duration_minutes: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
