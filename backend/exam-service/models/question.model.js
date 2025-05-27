import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question_text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctOption: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    default: 1,
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
export { questionSchema, Question };
