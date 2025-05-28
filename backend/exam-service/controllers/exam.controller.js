import Exam from "../models/exam.model.js";
import mongoose from "mongoose";
// Get all Exams
const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate("questionIds", "-correctOption");
    res.status(200).json(exams);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Error fetching exams: ", error: error.message });
  }
};
const getExamById = (req, res) => {
  const { id } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(id) === false) {
      return res.status(400).json({ message: "Invalid Exam ID format" });
    }
    const exam = Exam.findById(id).populate("questionIds");
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

const getExamByIdWithQuestions = (req, res) => {
  const { id } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(id) === false) {
      return res.status(400).json({ message: "Invalid Exam ID format" });
    }
    const exam = Exam.findById(id).populate("questionIds");
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

const createExam = (req, res) => {
  const { title, description, duration_minutes, start_time } = req.body;

  if (!title || !description || !duration_minutes || !start_time) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newExam = new Exam({
    title,
    description,
    duration_minutes,
    start_time: new Date(start_time), // Ensure start_time is a Date object
  });

  newExam
    .save()
    .then((exam) => {
      res.status(201).json(exam);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error creating exam", error: error.message });
    });
};
const updateExam = (req, res) => {
  const { id } = req.params;
  const { title, description, duration_minutes } = req.body;

  Exam.findByIdAndUpdate(
    id,
    { title, description, duration_minutes },
    { new: true }
  )
    .then((exam) => {
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      res.status(200).json(exam);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error updating exam", error: error.message });
    });
};
const deleteExam = (req, res) => {
  const { id } = req.params;

  Exam.findByIdAndDelete(id)
    .then((exam) => {
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      res.status(200).json({ message: "Exam deleted successfully" });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error deleting exam", error: error.message });
    });
};

export default {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
};
