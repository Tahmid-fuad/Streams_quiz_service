import Question from "../models/question.model.js";

// Get all Questions
const getAllQuestions = async (req, res) => {
  try {
    const { examId } = req.query || req.body || req.params;
    if (!examId) {
      return res.status(400).json({ message: "Exam ID is required" });
    }
    // serve the questions for the exam
    const questions = await Question.find({ examId }).populate("examId");
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
  const { question_text, options, correctOption, examId } = req.body;
  try {
    const newQuestion = new Question({
      question_text,
      options,
      correctOption,
      examId,
    });
    await newQuestion.save();
    res.status(201).json(newQuestion);
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
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
export default {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
