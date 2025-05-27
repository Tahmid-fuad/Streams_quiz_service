import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    duration_minutes: Number,
    questionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
    ],
    total_score: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
export { examSchema, Exam };
