import mongoose from "mongoose";

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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    start_time: {
      type: Date,
      required: true,
    },
    answers: [answerSchema],
    ObtainedScore: Number,
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

export default Submission;
export { answerSchema, submissionSchema, Submission };
