import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createExam, getAllExams } from "../services/api/quiz";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

export default function Exams({ currentPage, setCurrentPage }) {
  const { user } = useContext(AuthContext);
  const [view, setView] = useState("upcoming");
  const [exam, setExam] = useState({ subject: "", fullMarks: "", duration: "", startTime: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getAllExams();
        setExams(data);
      } catch (error) {
        setErrorMessage("Error fetching exams: " + (error.response?.data?.message || error.message));
      }
    };
    fetchExams();
  }, []);

  const categorizeExams = () => {
    const now = new Date();
    const upcoming = [];
    const ongoing = [];
    const completed = [];

    exams.forEach((exam) => {
      const start = new Date(exam.start_time);
      const end = new Date(start.getTime() + exam.duration_minutes * 60 * 1000);

      if (now < start) {
        upcoming.push(exam);
      } else if (now >= start && now <= end) {
        ongoing.push(exam);
      } else if (now > end) {
        completed.push(exam);
      }
    });

    return { upcoming, ongoing, completed };
  };

  const { upcoming, ongoing, completed } = categorizeExams();

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const formatTime = (isoDate, durationMinutes) => {
    const start = new Date(isoDate);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
    return `${start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} - ${end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""} ${mins > 0 ? `${mins} min` : ""}` : `${mins} min`;
  };

  const handleChange = (e) => {
    setExam({ ...exam, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage("Please log in to create an exam");
      return;
    }
    try {
      const examData = {
        title: exam.subject,
        description: exam.subject,
        duration_minutes: Number(exam.duration),
        start_time: exam.startTime ? new Date(exam.startTime).toISOString() : undefined,
      };
      const response = await createExam(examData);
      localStorage.setItem("currentExamId", response._id);
      setSuccessMessage("Exam created! Redirecting to add questions...");
      setTimeout(() => {
        navigate("/admin/examquestions");
      }, 1500);
    } catch (error) {
      setErrorMessage("Error creating exam: " + (error.response?.data?.message || error.message));
    }
  };

  const sectionTitleStyle = "text-2xl font-bold mb-6 text-indigo-800 flex items-center gap-2";
  const cardStyle = "p-6 bg-white rounded-2xl border border-indigo-100 shadow-md hover:shadow-xl transition transform hover:-translate-y-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white text-gray-800 flex flex-col">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-center gap-4 mb-10">
          {["upcoming", "ongoing", "completed", "setup"].map((type) => (
            <button
              key={type}
              onClick={() => setView(type)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${view === type ? "bg-indigo-600 text-white shadow" : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-100"}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {view === "upcoming" && (
          <section className="mb-12">
            <h3 className={sectionTitleStyle}>📅 Upcoming Exams</h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((exam) => (
                <div key={exam._id} className={cardStyle}>
                  <h4 className="text-xl font-bold text-indigo-700 mb-2">{exam.title}</h4>
                  <div className="text-sm text-gray-700 space-y-1 mb-4">
                    <p><strong>📆 Date:</strong> {formatDate(exam.start_time)}</p>
                    <p><strong>🕒 Time:</strong> {formatTime(exam.start_time, exam.duration_minutes)}</p>
                    <p><strong>⏱️ Duration:</strong> {formatDuration(exam.duration_minutes)}</p>
                    <p><strong>📊 Total Marks:</strong> {exam.total_score}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/exam/${exam._id}`)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition font-semibold"
                  >
                    View Exam
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === "ongoing" && (
          <section className="mb-12">
            <h3 className={sectionTitleStyle}>🟢 Ongoing Exams</h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {ongoing.map((exam) => (
                <div key={exam._id} className={cardStyle}>
                  <h4 className="text-xl font-bold text-indigo-700 mb-2">{exam.title}</h4>
                  <div className="text-sm text-gray-700 space-y-1 mb-4">
                    <p><strong>📆 Date:</strong> {formatDate(exam.start_time)}</p>
                    <p><strong>🕒 Time:</strong> {formatTime(exam.start_time, exam.duration_minutes)}</p>
                    <p><strong>⏱️ Duration:</strong> {formatDuration(exam.duration_minutes)}</p>
                    <p><strong>📊 Total Marks:</strong> {exam.total_score}</p>
                    <p className="text-green-600 font-medium">🟢 Live Now</p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/exam/${exam._id}`)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition font-semibold"
                  >
                    View Exam
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === "completed" && (
          <section className="mb-12">
            <h3 className={sectionTitleStyle}>✅ Completed Exams</h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {completed.map((exam) => (
                <div key={exam._id} className={cardStyle}>
                  <h4 className="text-xl font-bold text-indigo-700 mb-2">{exam.title}</h4>
                  <div className="text-sm text-gray-700 space-y-1 mb-4">
                    <p><strong>📆 Date:</strong> {formatDate(exam.start_time)}</p>
                    <p><strong>🕒 Time:</strong> {formatTime(exam.start_time, exam.duration_minutes)}</p>
                    <p><strong>⏱️ Duration:</strong> {formatDuration(exam.duration_minutes)}</p>
                    <p><strong>📊 Total Marks:</strong> {exam.total_score}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/exam/${exam._id}`)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition font-semibold">
                    View Exam
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === "setup" && (
          <section className="mb-12 max-w-xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">🗂️ Create New Exam</h2>
              {successMessage && (
                <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>
              )}
              {errorMessage && (
                <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-medium mb-1">Subject Name</label>
                  <input type="text" name="subject" value={exam.subject} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block font-medium mb-1">Full Marks</label>
                  <input type="number" name="fullMarks" value={exam.fullMarks} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block font-medium mb-1">Duration (minutes)</label>
                  <input type="number" name="duration" value={exam.duration} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block font-medium mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={exam.startTime}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
                  Proceed to Add Questions
                </button>
              </form>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}