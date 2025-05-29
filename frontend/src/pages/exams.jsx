import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, CheckCircle2, XCircle } from "lucide-react";

const API_URL = "http://localhost:3001/api/exams";

export default function Exams({ currentPage, setCurrentPage }) {
  const [view, setView] = useState("upcoming");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setExams(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch exams. Please try again later.");
      console.error("Error fetching exams:", err);
    } finally {
      setLoading(false);
    }
  };

  const getExamStatus = (exam) => {
    const now = new Date();
    const startTime = new Date(exam.start_time);
    const endTime = new Date(startTime.getTime() + exam.duration_minutes * 60000);

    if (now < startTime) return "upcoming";
    if (now >= startTime && now <= endTime) return "ongoing";
    return "completed";
  };

  const handleStartExam = (exam) => {
    setSelectedExam(exam);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswerSelect = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const calculateScore = () => {
    if (!selectedExam) return 0;
    let totalScore = 0;
    let maxScore = 0;

    selectedExam.questionIds.forEach(question => {
      maxScore += question.score;
      if (answers[question._id] === question.correctOption) {
        totalScore += question.score;
      }
    });

    return {
      score: totalScore,
      maxScore,
      percentage: (totalScore / maxScore) * 100
    };
  };

  const filteredExams = exams.filter(exam => getExamStatus(exam) === view);

  const sectionTitleStyle = "text-2xl font-bold mb-6 text-indigo-800 flex items-center gap-2";
  const cardStyle = "p-6 bg-white rounded-2xl border border-indigo-100 shadow-md hover:shadow-xl transition transform hover:-translate-y-1";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white text-gray-800 flex flex-col">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-center gap-4 mb-10">
          {["upcoming", "ongoing", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setView(type)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                view === type
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-100"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {selectedExam ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-800">{selectedExam.title}</h2>
                <button
                  onClick={() => setSelectedExam(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Back to Exams
                </button>
              </div>
              
              {!showResults ? (
                <div className="space-y-8">
                  {selectedExam.questionIds.map((question, index) => (
                    <div key={question._id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <span className="bg-indigo-100 text-indigo-800 font-semibold px-3 py-1 rounded-full">
                          Question {index + 1}
                        </span>
                        <span className="text-sm text-gray-500">
                          Score: {question.score} points
                        </span>
                      </div>
                      <p className="mt-4 text-lg font-medium text-gray-800">{question.question_text}</p>
                      <div className="mt-4 space-y-3">
                        {question.options.map((option, optIndex) => (
                          <label
                            key={optIndex}
                            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              answers[question._id] === option
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-gray-200 hover:border-indigo-200"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${question._id}`}
                              value={option}
                              checked={answers[question._id] === option}
                              onChange={() => handleAnswerSelect(question._id, option)}
                              className="hidden"
                            />
                            <span className="flex-1">{option}</span>
                            {answers[question._id] === option && (
                              <CheckCircle2 className="text-indigo-500" size={20} />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowResults(true)}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                      Submit Exam
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {selectedExam.questionIds.map((question, index) => (
                    <div key={question._id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <span className="bg-indigo-100 text-indigo-800 font-semibold px-3 py-1 rounded-full">
                          Question {index + 1}
                        </span>
                        <span className="text-sm text-gray-500">
                          Score: {question.score} points
                        </span>
                      </div>
                      <p className="mt-4 text-lg font-medium text-gray-800">{question.question_text}</p>
                      <div className="mt-4 space-y-3">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`flex items-center p-4 rounded-lg border-2 ${
                              option === question.correctOption
                                ? "border-green-500 bg-green-50"
                                : answers[question._id] === option
                                ? "border-red-500 bg-red-50"
                                : "border-gray-200"
                            }`}
                          >
                            <span className="flex-1">{option}</span>
                            {option === question.correctOption ? (
                              <CheckCircle2 className="text-green-500" size={20} />
                            ) : answers[question._id] === option ? (
                              <XCircle className="text-red-500" size={20} />
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="bg-indigo-50 rounded-xl p-6 mt-8">
                    <h3 className="text-xl font-bold text-indigo-800 mb-4">Exam Results</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600">Your Score</p>
                        <p className="text-3xl font-bold text-indigo-800">
                          {calculateScore().score} / {calculateScore().maxScore}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">Percentage</p>
                        <p className="text-3xl font-bold text-indigo-800">
                          {calculateScore().percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                      <div
                        className="h-2.5 rounded-full bg-indigo-600"
                        style={{ width: `${calculateScore().percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <section className="mb-12">
            <h3 className={sectionTitleStyle}>
              {view === "upcoming" && "📅 Upcoming Exams"}
              {view === "ongoing" && "🟢 Ongoing Exams"}
              {view === "completed" && "✅ Completed Exams"}
            </h3>
            
            {filteredExams.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 text-lg">No {view} exams found.</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredExams.map((exam) => (
                  <div key={exam._id} className={cardStyle}>
                    <h4 className="text-xl font-bold text-indigo-700 mb-1">{exam.title}</h4>
                    <p className="text-gray-600 mb-2 italic">{exam.description}</p>
                    <div className="text-sm text-gray-700 space-y-1 mb-4">
                      <p>
                        <strong>📆 Date:</strong>{" "}
                        {format(new Date(exam.start_time), "MMMM dd, yyyy")}
                      </p>
                      <p>
                        <strong>🕒 Time:</strong>{" "}
                        {format(new Date(exam.start_time), "hh:mm a")} -{" "}
                        {format(
                          new Date(
                            new Date(exam.start_time).getTime() +
                              exam.duration_minutes * 60000
                          ),
                          "hh:mm a"
                        )}
                      </p>
                      <p>
                        <strong>⏱️ Duration:</strong> {exam.duration_minutes} minutes
                      </p>
                      <p>
                        <strong>📝 Questions:</strong> {exam.questionIds.length}
                      </p>
                      {view === "ongoing" && (
                        <p className="text-green-600 font-medium">🟢 Live Now</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleStartExam(exam)}
                      className={`w-full text-white py-2 px-4 rounded-lg transition font-semibold ${
                        view === "upcoming"
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : view === "ongoing"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-600 hover:bg-gray-700"
                      }`}
                    >
                      {view === "upcoming"
                        ? "Book a Seat"
                        : view === "ongoing"
                        ? "Start Exam"
                        : "View Results"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
