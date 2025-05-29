import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { getStudentExamDetails } from "./../services/api/quiz";

export default function ExamPage() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [examFinished, setExamFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const response = await getStudentExamDetails(examId);
        setExam(response);
        setTimeLeft(response.duration_minutes * 60); // Convert minutes to seconds
        setError(null);
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
    if (timeLeft <= 0 && !examFinished) {
      finishExam();
      return;
    }
    if (!examFinished && timeLeft !== null) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, examFinished]);

  const finishExam = () => {
    setExamFinished(false);
    clearTimeout(timerRef.current);
    // TODO: Implement submission API call here later
  };

  const handleOptionSelect = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
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

  if (examFinished) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <motion.main
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto p-6 flex-grow flex flex-col items-center justify-center"
        >
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">Exam Completed!</h1>
          <p className="text-xl mb-6">
            Your answers have been submitted. Results will be available soon.
          </p>
          <button
            onClick={() => window.location.reload()}
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
          <h2 className="text-2xl font-bold text-indigo-700">{exam.title}</h2>
          <div className="text-yellow-600 font-mono font-bold text-xl bg-yellow-100 px-4 py-2 rounded shadow">
            Time Left: {formatTime(timeLeft)}
          </div>
        </header>

        {/* Questions List */}
        <div className="space-y-8 bg-white p-6 rounded-lg shadow">
          {exam.questionIds.map((question, idx) => {
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
                  {question.options.map((opt, optIdx) => (
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
          Answered {Object.keys(answers).length} / {exam.questionIds.length} questions
        </div>

        {/* Submit Button */}
        <div className="mt-2 flex justify-center">
          <button
            onClick={finishExam}
            className="px-6 py-3 rounded-lg font-semibold bg-yellow-400 hover:bg-yellow-500 text-white transition"
          >
            Submit Exam
          </button>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}