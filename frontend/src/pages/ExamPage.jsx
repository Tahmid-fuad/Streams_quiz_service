import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { getStudentExamDetails } from "./../services/api/quiz";
import { AuthContext } from "../context/AuthContext";
import { submitExam } from "../services/api/submission";

export default function ExamPage() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [examFinished, setExamFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const timerRef = useRef(null);
  const { user } = useContext(AuthContext);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(() => new Date().toISOString());

  useEffect(() => {
    // Check if exam was already submitted
    const storedResult = localStorage.getItem(`submissionResult_${examId}`);
    if (storedResult) {
      setSubmissionResult(JSON.parse(storedResult));
      setExamFinished(true);
      setLoading(false);
      return;
    }

    const fetchExam = async () => {
      try {
        setLoading(true);
        const response = await getStudentExamDetails(examId);
        setExam(response);
        const timeInSeconds = response.duration_minutes * 60;
        setTimeLeft(timeInSeconds);
        setError(null);
        
        // Only start timer after a brief delay to ensure component is ready
        setTimeout(() => {
          setTimerStarted(true);
        }, 100);
      } catch (err) {
        setError("Failed to fetch exam. Please try again later.");
        console.error("Error fetching exam:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  useEffect(() => {
    // Only run timer logic if timer has been explicitly started
    if (!timerStarted || examFinished || timeLeft === null) {
      return;
    }

    // Check if exam was already submitted (additional safety check)
    const storedResult = localStorage.getItem(`submissionResult_${examId}`);
    if (storedResult) {
      return;
    }

    // Auto-submit when time runs out
    if (timeLeft <= 0) {
      finishExam();
      return;
    }

    // Continue countdown
    timerRef.current = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, examFinished, timerStarted, examId]);

  const finishExam = async () => {
    // Prevent multiple submissions
    if (submitting || examFinished) {
      return;
    }

    setSubmitting(true);
    
    // Clear any running timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    try {
      // Prepare answers in API format
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedIndex]) => {
        const question = exam.questionIds.find(q => q._id === questionId);
        const selectedValue = question ? question.options[selectedIndex] : undefined;
        return {
          question_id: questionId,
          selected_option: selectedValue,
        };
      });
      const payload = {
        user_id: user?.id,
        answers: formattedAnswers,
        start_time: startTime,
      };
      const result = await submitExam(examId, payload);
      setSubmissionResult(result);
      setExamFinished(true);
      localStorage.setItem(`submissionResult_${examId}`, JSON.stringify(result));
    } catch (err) {
      setError("Failed to submit exam. Please try again later.");
      console.error("Error submitting exam:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOptionSelect = (questionId, optionIndex) => {
    if (examFinished || submitting) {
      return;
    }
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const formatTime = (seconds) => {
    if (seconds === null || seconds < 0) {
      return "00:00";
    }
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleBackToExams = () => {
    localStorage.removeItem(`submissionResult_${examId}`);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (examFinished && submissionResult && exam && exam.questionIds) {
    // Calculate total correct
    const totalCorrect = submissionResult.submission?.answers?.filter(
      ans => ans.selected_option === ans.correct_option
    ).length;
    const totalQuestions = exam.questionIds.length;
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <motion.main
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto p-6 flex-grow flex flex-col items-center justify-center"
        >
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">Exam Results</h1>
          <div className="bg-white rounded-lg shadow p-6 mb-6 w-full max-w-2xl">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
              <h2 className="text-2xl font-bold text-green-700 mb-2">Score: <span className="font-bold">{submissionResult.submission?.totalScore} / {submissionResult.maxScore}</span></h2>
              <div className="text-lg font-semibold text-gray-700">Correct: <span className="text-green-600">{totalCorrect}</span> / <span className="text-gray-800">{totalQuestions}</span></div>
              <div className="text-lg font-semibold text-gray-700">Incorrect: <span className="text-red-600">{totalQuestions - totalCorrect}</span></div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Submitted at: {new Date(submissionResult.submission?.submitted_at).toLocaleString()}</p>
            <div className="space-y-8">
              {exam.questionIds.map((question, idx) => {
                const answer = submissionResult.submission?.answers?.find(a => a.question_id === question._id);
                const userSelected = answer ? answer.selected_option : null;
                const correct = answer ? answer.correct_option : null;
                return (
                  <motion.div
                    key={question._id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="border-b border-gray-200 pb-4"
                  >
                    <p className="text-lg font-semibold mb-3">
                      Q{idx + 1}. {question.question_text}
                    </p>
                    <div className="space-y-3">
                      {question.options?.map((opt, optIdx) => {
                        // Determine if this option is the user's answer or the correct answer
                        const isUser = userSelected === opt;
                        const isCorrect = correct === opt;
                        let radioColor = "border-gray-300";
                        if (isUser && isCorrect) radioColor = "bg-green-100 border-green-400";
                        else if (isUser && !isCorrect) radioColor = "bg-red-100 border-red-400";
                        else if (!isUser && isCorrect) radioColor = "bg-green-50 border-green-300";
                        return (
                          <label
                            key={optIdx}
                            className={`flex items-center space-x-3 cursor-pointer rounded p-2 border transition ${radioColor}`}
                          >
                            <input
                              type="radio"
                              name={`question-${question._id}`}
                              checked={isUser}
                              readOnly
                              className={`form-radio ${isUser && isCorrect ? "text-green-500" : isUser ? "text-red-500" : isCorrect ? "text-green-400" : "text-gray-400"}`}
                              disabled
                            />
                            <span className={`text-gray-800 ${isCorrect ? "font-bold" : ""}`}>{opt}</span>
                            {isUser && isCorrect && <span className="ml-2 text-green-600 font-semibold">(Correct)</span>}
                            {isUser && !isCorrect && <span className="ml-2 text-red-600 font-semibold">(Your Answer)</span>}
                            {!isUser && isCorrect && <span className="ml-2 text-green-600 font-semibold">(Correct Answer)</span>}
                          </label>
                        );
                      })}
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 font-medium">Mark: {answer ? answer.question_mark : 0}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-6 text-xl font-bold text-indigo-700 text-center">
              Total Score: {submissionResult.submission?.totalScore} / {submissionResult.maxScore}
            </div>
          </div>
          <button
            onClick={handleBackToExams}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
          >
            Back to Exams
          </button>
        </motion.main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto p-6 flex-grow max-w-4xl"
      >
        {/* Header */}
        <header className="flex justify-between items-center mb-6 bg-white rounded shadow p-4">
          <h2 className="text-2xl font-bold text-indigo-700">{exam?.title}</h2>
          <div className="text-yellow-600 font-mono font-bold text-xl bg-yellow-100 px-4 py-2 rounded shadow">
            Time Left: {formatTime(timeLeft)}
          </div>
        </header>

        {/* Questions List */}
        <div className="space-y-8 bg-white p-6 rounded-lg shadow">
          {exam?.questionIds?.map((question, idx) => {
            const selectedOption = answers[question._id];
            return (
              <motion.div
                key={question._id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="border-b border-gray-200 pb-4"
              >
                <p className="text-lg font-semibold mb-3">
                  Q{idx + 1}. {question.question_text}
                </p>
                <div className="space-y-3">
                  {question.options?.map((opt, optIdx) => (
                    <label
                      key={optIdx}
                      className={`flex items-center space-x-3 cursor-pointer rounded p-2 border transition 
                      ${
                        selectedOption === optIdx
                          ? "bg-yellow-100 border-yellow-400"
                          : "border-gray-300 hover:border-yellow-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question._id}`}
                        checked={selectedOption === optIdx}
                        onChange={() => handleOptionSelect(question._id, optIdx)}
                        className="form-radio text-yellow-500"
                        disabled={submitting}
                      />
                      <span className="text-gray-800">{opt}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Answered Count */}
        <div className="mb-4 text-center text-gray-700 font-medium">
          Answered {Object.keys(answers).length} / {exam?.questionIds?.length || 0} questions
        </div>

        {/* Submit Button */}
        <div className="mt-2 flex justify-center">
          <button
            onClick={finishExam}
            disabled={submitting}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              submitting 
                ? "bg-gray-400 cursor-not-allowed text-gray-700" 
                : "bg-yellow-400 hover:bg-yellow-500 text-white"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Exam"}
          </button>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}