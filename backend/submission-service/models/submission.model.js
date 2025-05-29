const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  selected_option: String,
  correct_option: String,
  question_mark: Number,
});

const submissionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exam_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    answers: [answerSchema],
    totalScore: Number,
    submitted_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;
