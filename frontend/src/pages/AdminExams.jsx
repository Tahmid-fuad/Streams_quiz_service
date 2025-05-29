import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createExam, getAllExams, updateExam, deleteExam } from "../services/api/quiz";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

export default function Exams({ currentPage, setCurrentPage }) {
  const { user } = useContext(AuthContext);
  const [view, setView] = useState("upcoming");
  const [exam, setExam] = useState({ subject: "", duration: "", startTime: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [exams, setExams] = useState([]);
  const [editExam, setEditExam] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
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

  const handleEditChange = (e) => {
    setEditExam({ ...editExam, [e.target.name]: e.target.value });
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
        total_score: 0,
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const examData = {
        title: editExam.title,
        duration_minutes: Number(editExam.duration_minutes),
        start_time: new Date(editExam.start_time).toISOString(),
      };
      await updateExam(editExam._id, examData);
      setExams(exams.map((e) => (e._id === editExam._id ? { ...e, ...examData } : e)));
      setSuccessMessage("Exam updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      setErrorMessage("Error updating exam: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (examId) => {
    setExamToDelete(examId);
    setShowDeleteModal(true);
  };

  const openEditModal = (exam) => {
    const localStartTime = new Date(new Date(exam.start_time).getTime() + 6 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16);
    setEditExam({
      _id: exam._id,
      title: exam.title,
      duration_minutes: exam.duration_minutes,
      start_time: localStartTime,
    });
    setShowEditModal(true);
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/exam/${exam._id}`)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition font-semibold"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openEditModal(exam)}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exam._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition font-semibold"
                    >
                      Delete
                    </button>
                  </div>
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/exam/${exam._id}`)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition font-semibold"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openEditModal(exam)}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exam._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition font-semibold"
                    >
                      Delete
                    </button>
                  </div>
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/exam/${exam._id}`)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition font-semibold"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openEditModal(exam)}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exam._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition font-semibold"
                    >
                      Delete
                    </button>
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
              {view !== "setup" && successMessage && (
                <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>
              )}
              {view !== "setup" && errorMessage && (
                <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-medium mb-1">Subject Name</label>
                  <input type="text" name="subject" value={exam.subject} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
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

        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6 text-indigo-700">Edit Exam</h2>
              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div>
                  <label className="block font-medium mb-1">Subject Name</label>
                  <input
                    type="text"
                    name="title"
                    value={editExam.title}
                    onChange={handleEditChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration_minutes"
                    value={editExam.duration_minutes}
                    onChange={handleEditChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    name="start_time"
                    value={editExam.start_time}
                    onChange={handleEditChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4 text-indigo-700">Are you sure?</h2>
              <p className="text-gray-600 mb-6">Do you want to delete this exam? This action cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    try {
                      await deleteExam(examToDelete);
                      setExams(exams.filter((e) => e._id !== examToDelete));
                      setSuccessMessage("Exam deleted successfully!");
                    } catch (error) {
                      setErrorMessage("Error deleting exam: " + (error.response?.data?.message || error.message));
                    }
                    setShowDeleteModal(false);
                    setExamToDelete(null);
                  }}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setExamToDelete(null);
                  }}
                  className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}