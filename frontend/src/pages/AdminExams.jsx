import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createExam } from "../services/api/quiz";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

const upcomingExams = [
  { id: 1, subject: "Math", date: "2025-06-10", time: "10:00 AM - 12:00 PM", duration: "2 hours" },
  { id: 2, subject: "Science", date: "2025-06-12", time: "10:00 AM - 12:00 PM", duration: "2 hours" },
  { id: 3, subject: "Geography", date: "2025-06-14", time: "11:00 AM - 1:00 PM", duration: "2 hours" },
  { id: 4, subject: "Computer Science", date: "2025-06-15", time: "9:00 AM - 11:00 AM", duration: "2 hours" },
  { id: 5, subject: "Economics", date: "2025-06-17", time: "1:00 PM - 3:00 PM", duration: "2 hours" },
  { id: 6, subject: "Physical Education", date: "2025-06-18", time: "10:30 AM - 12:00 PM", duration: "1.5 hours" },
];

const ongoingExams = [
  { id: 7, subject: "History", date: "2025-05-26", time: "9:00 AM - 11:00 AM", duration: "2 hours", status: "Ongoing" },
  { id: 8, subject: "Biology", date: "2025-05-26", time: "11:00 AM - 1:00 PM", duration: "2 hours", status: "Ongoing" },
  { id: 9, subject: "Chemistry", date: "2025-05-26", time: "2:00 PM - 4:00 PM", duration: "2 hours", status: "Ongoing" },
  { id: 10, subject: "Environmental Science", date: "2025-05-26", time: "1:00 PM - 3:00 PM", duration: "2 hours", status: "Ongoing" },
  { id: 11, subject: "Civics", date: "2025-05-26", time: "3:00 PM - 5:00 PM", duration: "2 hours", status: "Ongoing" },
  { id: 12, subject: "Language Studies", date: "2025-05-26", time: "4:00 PM - 5:30 PM", duration: "1.5 hours", status: "Ongoing" },
];

const completedExams = [
  { id: 13, subject: "English", date: "2025-05-20", time: "10:00 AM - 12:00 PM", duration: "2 hours", score: 88 },
  { id: 14, subject: "Art", date: "2025-05-22", time: "1:00 PM - 2:30 PM", duration: "1.5 hours", score: 95 },
  { id: 15, subject: "Physics", date: "2025-05-18", time: "9:00 AM - 11:00 AM", duration: "2 hours", score: 81 },
  { id: 16, subject: "Sociology", date: "2025-05-19", time: "11:00 AM - 1:00 PM", duration: "2 hours", score: 73 },
  { id: 17, subject: "Business Studies", date: "2025-05-21", time: "2:00 PM - 4:00 PM", duration: "2 hours", score: 66 },
  { id: 18, subject: "Music", date: "2025-05-23", time: "9:30 AM - 11:00 AM", duration: "1.5 hours", score: 92 },
];

export default function Exams({ currentPage, setCurrentPage }) {
  const { user } = useContext(AuthContext);
  const [view, setView] = useState("upcoming");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [exam, setExam] = useState({ subject: "", fullMarks: "", duration: "", startTime: "" });

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
              {upcomingExams.map((exam) => (
                <div key={exam.id} className={cardStyle}>
                  <h4 className="text-xl font-bold text-indigo-700 mb-2">{exam.subject}</h4>
                  <div className="text-sm text-gray-700 space-y-1 mb-4">
                    <p><strong>📆 Date:</strong> {exam.date}</p>
                    <p><strong>🕒 Time:</strong> {exam.time}</p>
                    <p><strong>⏱️ Duration:</strong> {exam.duration}</p>
                  </div>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition font-semibold">
                    Book a Seat
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
              {ongoingExams.map((exam) => (
                <div key={exam.id} className={cardStyle}>
                  <h4 className="text-xl font-bold text-indigo-700 mb-2">{exam.subject}</h4>
                  <div className="text-sm text-gray-700 space-y-1 mb-4">
                    <p><strong>📆 Date:</strong> {exam.date}</p>
                    <p><strong>🕒 Time:</strong> {exam.time}</p>
                    <p><strong>⏱️ Duration:</strong> {exam.duration}</p>
                    <p className="text-green-600 font-medium">🟢 Live Now</p>
                  </div>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition font-semibold">
                    Start Exam
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
              {completedExams.map((exam) => (
                <div key={exam.id} className={cardStyle}>
                  <h4 className="text-xl font-bold text-indigo-700 mb-2">{exam.subject}</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>📆 Date:</strong> {exam.date}</p>
                    <p><strong>🕒 Time:</strong> {exam.time}</p>
                    <p><strong>⏱️ Duration:</strong> {exam.duration}</p>
                    <p className="flex items-center gap-2">
                      <strong>🏁 Score:</strong>
                      <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full ${exam.score >= 90 ? "bg-green-100 text-green-800" : exam.score >= 70 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                        {exam.score}%
                      </span>
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div className={`h-2.5 rounded-full ${exam.score >= 90 ? "bg-green-500" : exam.score >= 70 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${exam.score}%` }}></div>
                    </div>
                  </div>
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