const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question_id: String,
  selected_option: String,
});

const submissionSchema = new mongoose.Schema(
  {
    user_id: String,
    exam_id: String,
    answers: [answerSchema],
    score: Number,
    started_at: Date,
    submitted_at: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;
