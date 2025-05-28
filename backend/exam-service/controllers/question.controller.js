import mongoose from "mongoose";
import Question from "../models/question.model.js";
import Exam from "../models/exam.model.js";

// Get all Questions
const getAllQuestions = async (req, res) => {
  try {
    const { examId } = req.params;

    if (!examId) {
      return res.status(400).json({ message: "Exam ID is required" });
    } else {
      // Check if the examId is valid object ID and the exam exists
      if (mongoose.Types.ObjectId.isValid(examId)) {
        const exam = await Exam.findById(examId);
        if (!exam) {
          return res.status(404).json({ message: "Exam not found!" });
        }
      } else {
        return res.status(400).json({
          message: "Invalid Exam ID format. Please provide a valid object ID",
        });
      }
    }
    // Fetch the questions for the given examId without the answer field
    const questions = await Question.find({ examId: examId }).select(
      "-correctOption"
    );
    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: "Questions not found" });
    }

    res.status(200).json(questions);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Error fetching questions", error: error.message });
  }
};

const getAllQNA = async (req, res) => {
  try {
    const { examId } = req.params;

    if (!examId) {
      return res.status(400).json({ message: "Exam ID is required" });
    } else {
      // Check if the exam exists
      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found!" });
      }
    }
    // Fetch the questions for the given examId
    const questions = await Question.find({ examId: examId });
    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: "Questions not found" });
    }

    res.status(200).json(questions);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Error fetching questions", error: error.message });
  }
};

// Get Question by ID
const getQuestionById = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(question);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching question", error: error.message });
  }
};

// Create a new Question
const createQuestion = async (req, res) => {
  const { question_text, options, correctOption, score } = req.body;
  const { examId } = req.params;

  if (!examId) {
    return res.status(400).json({ message: "Exam ID is required" });
  } else {
    // Check if the examId is valid object ID and the exam exists
    if (mongoose.Types.ObjectId.isValid(examId)) {
      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found!" });
      }
    } else {
      return res.status(400).json({
        message: "Invalid Exam ID format. Please provide a valid object ID",
      });
    }
  }

  try {
    const newQuestion = new Question({
      question_text,
      options,
      correctOption,
      score,
      examId,
    });
    await newQuestion.save();
    await Exam.findByIdAndUpdate(
      examId,
      { $push: { questionIds: newQuestion._id } },
      { new: true }
    );
    res.status(201).json(newQuestion);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating question", error: error.message });
  }
};

const createMultipleQuestions = async (req, res) => {
  const { questions } = req.body;
  const { examId } = req.params;

  if (!examId) {
    return res.status(400).json({ message: "Exam ID is required" });
  }

  try {
    questions.forEach((question) => {
      if (
        !question.question_text ||
        !question.options ||
        !question.correctOption
      ) {
        throw new Error("All fields are required for each question");
      }
      question.examId = examId;
    });

    const newQuestions = await Question.insertMany(questions);
    if (!newQuestions || newQuestions.length === 0) {
      return res.status(400).json({ message: "No questions created" });
    }

    const newQuestionsScore = newQuestions.reduce(
      (total, q) => total + q.score,
      0
    );

    const exam = await Exam.findByIdAndUpdate(
      examId,
      {
        $push: {
          questionIds: { $each: newQuestions.map((q) => q._id) },
        },
        $inc: {
          total_score: newQuestionsScore,
        },
      },
      { new: true }
    );
    if (!exam) {
      return res.status(404).json({ message: "Exam not found!" });
    }

    res.status(201).json(newQuestions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating question", error: error.message });
  }
};

// Update a Question
const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { question_text, options, correctOption } = req.body;
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { question_text, options, correctOption },
      { new: true }
    );
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating question", error: error.message });
  }
};

// Delete a Question
const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting question", error: error.message });
  }
};

export {
  getAllQuestions,
  getAllQNA,
  getQuestionById,
  createQuestion,
  createMultipleQuestions,
  updateQuestion,
  deleteQuestion,
};
export default {
  getAllQuestions,
  getAllQNA,
  getQuestionById,
  createQuestion,
  createMultipleQuestions,
  updateQuestion,
  deleteQuestion,
};
