import jwt from "jsonwebtoken";
import axios from "axios";
import Submission from "../models/submission.model.js";

import user from "../models/user.model.js";
// POST /api/submissions
const submitExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body;

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;

    // Call the exam service to get exam details
    const examResponse = await axios.get(
      `${process.env.EXAM_SERVICE_URL}/api/exams/${examId}`
    );
    const exam = examResponse.data;
    const evaluatedAnswers = answers.map((answer) => {
      const question = exam.questions.find((q) => q._id === answer.question_id);
      return {
        question_id: answer.question_id,
        selected_option: answer.selected_option,
        correct_option: question.correctOption,
      };
    });

    const submission = await Submission.create({
      user_id: userId,
      exam_id: examId,
      score: exam.calculateScore(answers),
    });
    res.status(201).json({
      message: "Exam submitted successfully",
      submission,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to submit exam", error: error.message });
  }
};

// GET /api/submissions/user/:userId
const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user_id: req.params.userId });
    res.status(200).json(submissions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch submissions", error: error.message });
  }
};

export default {
  submitExam,
  getUserSubmissions,
};

export { submitExam, getUserSubmissions };
