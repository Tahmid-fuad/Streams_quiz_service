const Submission = require("./models/submission.model");
const axios = require("axios");

// POST /api/submissions
const submitExam = async (req, res) => {
  try {
    const { user_id, exam_id, answers, started_at } = req.body;

    if (!user_id || !exam_id || !answers) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch all questions for this exam from exam-service
    const examServiceUrl = process.env.EXAM_SERVICE_URL 
    const { data: questions } = await axios.get(
      `${examServiceUrl}/${exam_id}/questions`
    );

    console.log(questions);

 // Map question_id to question details for quick lookup
    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id] = q;
    });

    // Attach correct_option (as value, not index) to each answer and calculate total score
    let totalScore = 0;
    const enrichedAnswers = answers.map((ans) => {
      const question = questionMap[ans.question_id];
      // If question.correctOption is an index (number as string), parse it
      let correct_option = null;
      if (question) {
        const correctIndex = isNaN(question.correctOption)
          ? question.options.indexOf(question.correctOption)
          : parseInt(question.correctOption, 10);
        correct_option =
          question.options[correctIndex] !== undefined
            ? question.options[correctIndex]
            : null;
        if (ans.selected_option === correct_option) {
          totalScore += question.score || 1;
        }
      }
      return {
        ...ans,
        correct_option,
      };
    });
    const maxScore = questions.reduce((sum, q) => sum + (q.score || 1), 0);

    const submitted_at = new Date();

    const submission = new Submission({
      user_id,
      exam_id,
      answers: enrichedAnswers,
      totalScore,
      started_at,
      submitted_at,
    });

    await submission.save();
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
