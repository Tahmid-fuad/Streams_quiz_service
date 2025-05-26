const Submission = require("./models/submission.model");

// POST /api/submissions
const submitExam = async (req, res) => {
  try {
    const { user_id, exam_id, answers, started_at } = req.body;

    if (!user_id || !exam_id || !answers) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const submitted_at = new Date();
    const score = calculateScore(answers); // Optional scoring logic

    const submission = new Submission({
      user_id,
      exam_id,
      answers,
      score,
      started_at,
      submitted_at,
    });

    await submission.save();
    res.status(201).json({ message: "Exam submitted", submission });
  } catch (error) {
    res.status(500).json({ message: "Submission failed", error: error.message });
  }
};

// GET /api/submissions/user/:userId
const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user_id: req.params.userId });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch submissions", error: error.message });
  }
};

// (Optional) Basic scoring (stub)
function calculateScore(answers) {
  // You may fetch correct answers from exam-service here via internal API
  return answers.length; // Dummy logic: 1 mark per question
}

module.exports = {
  submitExam,
  getUserSubmissions,
};
