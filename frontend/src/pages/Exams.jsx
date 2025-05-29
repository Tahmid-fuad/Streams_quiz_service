import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { format } from "date-fns";
import { getAllStudentExams } from "./../services/api/quiz";

export default function Exams({ currentPage, setCurrentPage }) {
  const [view, setView] = useState("upcoming");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await getAllStudentExams();
      setExams(response);
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

  const handleStartExam = (examId) => {
    navigate(`/exampage/${examId}`);
  };

  const filteredExams = exams.filter((exam) => getExamStatus(exam) === view);

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
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${view === type
                ? "bg-indigo-600 text-white shadow"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-100"
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-indigo-800 flex items-center gap-2">
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
                    <p>
                      <strong>🏆 Total Score:</strong> {exam.total_score}
                    </p>
                    {view === "ongoing" && (
                      <p className="text-green-600 font-medium">🟢 Live Now</p>
                    )}
                  </div>
                  {view !== "upcoming" && (
                    <button
                      onClick={() => handleStartExam(exam._id)}
                      className={`w-full text-white py-2 px-4 rounded-lg transition font-semibold ${view === "ongoing"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-600 hover:bg-gray-700"
                        }`}
                    >
                      {view === "ongoing" ? "Start Exam" : "View Results"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}