import { useState, useEffect, useRef } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const sampleExam = {
  subject: "Mathematics",
  duration: 5, // minutes
  questions: [
    {
      id: 1,
      question: "What is 2 + 2?",
      options: ["1", "2", "3", "4"],
      answer: 3,
    },
    {
      id: 2,
      question: "What is 10 / 2?",
      options: ["2", "5", "10", "20"],
      answer: 1,
    },
    {
      id: 3,
      question: "What is 5 * 6?",
      options: ["11", "30", "35", "25"],
      answer: 1,
    },
  ],
};

export default function TakeExam() {
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(sampleExam.duration * 60);
  const [examFinished, setExamFinished] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      finishExam();
      return;
    }
    timerRef.current = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  const finishExam = () => {
    setExamFinished(true);
    clearTimeout(timerRef.current);
  };

  const handleOptionSelect = (qIndex, optionIndex) => {
    setAnswers({ ...answers, [qIndex]: optionIndex });
  };

  const calculateScore = () => {
    let score = 0;
    sampleExam.questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) score++;
    });
    return score;
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (examFinished) {
    const score = calculateScore();
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
            Your score:{" "}
            <span className="font-semibold text-yellow-600">
              {score} / {sampleExam.questions.length}
            </span>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
          >
            Take Again
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
          <h2 className="text-2xl font-bold text-indigo-700">{sampleExam.subject}</h2>
          <div className="text-yellow-600 font-mono font-bold text-xl bg-yellow-100 px-4 py-2 rounded shadow">
            Time Left: {formatTime(timeLeft)}
          </div>
        </header>

        {/* Questions List */}
        <div className="space-y-8 bg-white p-6 rounded-lg shadow">
          {sampleExam.questions.map((question, idx) => {
            const selectedOption = answers[idx];
            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="border-b border-gray-200 pb-4"
              >
                <p className="text-lg font-semibold mb-3">
                  Q{idx + 1}. {question.question}
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
                        name={`question-${question.id}`}
                        checked={selectedOption === optIdx}
                        onChange={() => handleOptionSelect(idx, optIdx)}
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
          Answered {Object.keys(answers).length} / {sampleExam.questions.length} questions
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
