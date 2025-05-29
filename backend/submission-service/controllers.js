const Submission = require("./models/submission.model");
const axios = require("axios");

// POST /api/submissions
const submitExam = async (req, res) => {
  const examId = req.params.examId;

  try {
    const { answers, user_id } = req.body;
    if (!user_id || !examId || !answers) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch all questions for this exam from exam-service
    const examServiceUrl = process.env.EXAM_SERVICE_URL 
    const { data: questions } = await axios.get(
      `${examServiceUrl}/${examId}`
    );
    console.log(questions);

    if (!questions) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Map question_id to question details for quick lookup
    const questionMap = {};
    (questions.questionIds || []).forEach((q) => {
      questionMap[q._id] = q;
    });

    // Attach correct_option (as value, not index) to each answer and calculate total score
    let totalScore = 0;
    const enrichedAnswers = answers.map((ans) => {
      const question = questionMap[ans.question_id];
      let correct_option = null;
      let question_mark = null;
      if (question) {
        correct_option = question.correctOption;
        question_mark = question.score || 1;
        if (ans.selected_option === correct_option) {
          totalScore += question_mark;
        }
      }
      return {
        ...ans,
        correct_option,
        question_mark,
      };
    });
    const maxScore = (questions.questionIds || []).reduce((sum, q) => sum + (q.score || 1), 0);

    const submitted_at = new Date();

    const submission = new Submission({
      user_id,
      exam_id: examId,
      answers: enrichedAnswers,
      totalScore,
      submitted_at,
    });

    await submission.save();

    // Add submission ID to user's submissionIds array
    await require("./models/user.model").findByIdAndUpdate(
      user_id,
      { $push: { submissionIds: submission._id } },
      { new: true }
    );

    res.status(201).json({ message: "Exam submitted", submission, maxScore });
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

module.exports = {
  submitExam,
  getUserSubmissions,
};
