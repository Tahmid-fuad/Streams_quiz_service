import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { useNavigate } from "react-router-dom";

export default function AdminExamSetup() {
  const [exam, setExam] = useState({
    subject: "",
    fullMarks: "",
    duration: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setExam({ ...exam, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save exam setup info in localStorage
    localStorage.setItem("currentExam", JSON.stringify(exam));
    alert("Exam setup saved!");

    // Redirect to questions page
    navigate("/admin/examcquestions");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="container mx-auto p-6 max-w-xl">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">
            🗂️ Create New Exam
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium mb-1">Subject Name</label>
              <input
                type="text"
                name="subject"
                value={exam.subject}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Full Marks</label>
              <input
                type="number"
                name="fullMarks"
                value={exam.fullMarks}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={exam.duration}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            >
              Proceed to Add Questions
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
