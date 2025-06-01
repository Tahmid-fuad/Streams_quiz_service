import Exam from "../models/exam.model.js";
import mongoose from "mongoose";
// Get all Exams
const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate(
      "questions",
      "-correctOption -examId"
    );
    res.status(200).json(exams);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Error fetching exams: ", error: error.message });
  }
};

const getAllExamsWithAnswers = async (req, res) => {
  try {
    // Populate the questions field with all fields including correctOption and examId
    const exams = await Exam.find().populate("questions", "-examId");
    res.status(200).json(exams);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Error fetching exams: ", error: error.message });
  }
};
const getExamById = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id) === false) {
      return res.status(400).json({ message: "Invalid Exam ID format" });
    }

    const exam = await Exam.findById(id).populate(
      "questions",
      "-correctOption -examId"
    );
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json(exam);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching exam", error: error.message });
  }
};

const getExamByIdWithAnswers = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id) === false) {
      return res.status(400).json({ message: "Invalid Exam ID format" });
    }
    const exam = await Exam.findById(id).populate("questions", "-examId");
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json(exam);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching exam", error: error.message });
  }
};

const createExam = async (req, res) => {
  try {
    const { title, description, duration_minutes, start_time } = req.body;
    const newExam = new Exam({
      title,
      description,
      duration_minutes,
      start_time,
    });
    await newExam.save();
    res.status(201).json(newExam);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating exam", error: error.message });
  }
};
const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration_minutes, start_time } = req.body;
    const exam = await Exam.findByIdAndUpdate(
      id,
      { title, description, duration_minutes, start_time },
      { new: true }
    );
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json(exam);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating exam", error: error.message });
  }
};
const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id) === false) {
      return res.status(400).json({ message: "Invalid Exam ID format" });
    }
    const exam = await Exam.findByIdAndDelete(id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting exam", error: error.message });
  }
};

export default {
  getAllExams,
  getExamById,
  getAllExamsWithAnswers,
  getExamByIdWithAnswers,
  createExam,
  updateExam,
  deleteExam,
};
