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
    type: Number,
    required: true,
  },
  total_score: {
    type: Number,
    required: true,
    default: 1,
  },
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
export { questionSchema, Question };
