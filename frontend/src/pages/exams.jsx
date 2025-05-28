import { useState } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

const upcomingExams = [
  { id: 1, subject: "Math", title: "Final Term Algebra Test", date: "2025-06-10", time: "10:00 AM - 12:00 PM", duration: "2 hours" },
  { id: 2, subject: "Science", title: "Chemistry Theory Exam", date: "2025-06-12", time: "10:00 AM - 12:00 PM", duration: "2 hours" },
  { id: 3, subject: "Geography", title: "Maps & Environment Quiz", date: "2025-06-14", time: "11:00 AM - 1:00 PM", duration: "2 hours" },
  { id: 4, subject: "Computer Science", title: "Python Coding Test", date: "2025-06-15", time: "9:00 AM - 11:00 AM", duration: "2 hours" },
  { id: 5, subject: "Economics", title: "Microeconomics Analysis", date: "2025-06-17", time: "1:00 PM - 3:00 PM", duration: "2 hours" },
  { id: 6, subject: "Physical Education", title: "Fitness and Wellness Quiz", date: "2025-06-18", time: "10:30 AM - 12:00 PM", duration: "1.5 hours" },
];

const ongoingExams = [
  { id: 7, subject: "History", title: "World War II Assessment", date: "2025-05-26", time: "9:00 AM - 11:00 AM", duration: "2 hours", status: "Ongoing" },
  { id: 8, subject: "Biology", title: "Genetics and Evolution", date: "2025-05-26", time: "11:00 AM - 1:00 PM", duration: "2 hours", status: "Ongoing" },
  { id: 9, subject: "Chemistry", title: "Periodic Table Concepts", date: "2025-05-26", time: "2:00 PM - 4:00 PM", duration: "2 hours", status: "Ongoing" },
  { id: 10, subject: "Environmental Science", title: "Climate Change Quiz", date: "2025-05-26", time: "1:00 PM - 3:00 PM", duration: "2 hours", status: "Ongoing" },
  { id: 11, subject: "Civics", title: "Government and Constitution", date: "2025-05-26", time: "3:00 PM - 5:00 PM", duration: "2 hours", status: "Ongoing" },
  { id: 12, subject: "Language Studies", title: "Grammar and Composition", date: "2025-05-26", time: "4:00 PM - 5:30 PM", duration: "1.5 hours", status: "Ongoing" },
];

const completedExams = [
  { id: 13, subject: "English", title: "Literature Essay Exam", date: "2025-05-20", time: "10:00 AM - 12:00 PM", duration: "2 hours", score: 88 },
  { id: 14, subject: "Art", title: "Color Theory Practical", date: "2025-05-22", time: "1:00 PM - 2:30 PM", duration: "1.5 hours", score: 95 },
  { id: 15, subject: "Physics", title: "Mechanics Final", date: "2025-05-18", time: "9:00 AM - 11:00 AM", duration: "2 hours", score: 81 },
  { id: 16, subject: "Sociology", title: "Social Behavior Assessment", date: "2025-05-19", time: "11:00 AM - 1:00 PM", duration: "2 hours", score: 73 },
  { id: 17, subject: "Business Studies", title: "Market Strategies Exam", date: "2025-05-21", time: "2:00 PM - 4:00 PM", duration: "2 hours", score: 66 },
  { id: 18, subject: "Music", title: "Theory and Composition Test", date: "2025-05-23", time: "9:30 AM - 11:00 AM", duration: "1.5 hours", score: 100 },
];

export default function Exams({ currentPage, setCurrentPage }) {
  const [view, setView] = useState("upcoming");

  const sectionTitleStyle = "text-2xl font-bold mb-6 text-indigo-800 flex items-center gap-2";
  const cardStyle =
    "p-6 bg-white rounded-2xl border border-indigo-100 shadow-md hover:shadow-xl transition transform hover:-translate-y-1";

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

        {view === "upcoming" && (
          <section className="mb-12">
            <h3 className={sectionTitleStyle}>📅 Upcoming Exams</h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className={cardStyle}>
                  <h4 className="text-xl font-bold text-indigo-700 mb-1">{exam.subject}</h4>
                  <p className="text-gray-600 mb-2 italic">{exam.title}</p>
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
                  <h4 className="text-xl font-bold text-indigo-700 mb-1">{exam.subject}</h4>
                  <p className="text-gray-600 mb-2 italic">{exam.title}</p>
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
                  <h4 className="text-xl font-bold text-indigo-700 mb-1">{exam.subject}</h4>
                  <p className="text-gray-600 mb-2 italic">{exam.title}</p>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>📆 Date:</strong> {exam.date}</p>
                    <p><strong>🕒 Time:</strong> {exam.time}</p>
                    <p><strong>⏱️ Duration:</strong> {exam.duration}</p>
                    <p className="flex items-center gap-2">
                      <strong>🏁 Score:</strong>
                      <span
                        className={`inline-block text-sm font-bold px-3 py-1 rounded-full ${exam.score >= 90
                          ? "bg-green-100 text-green-800"
                          : exam.score >= 70
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {exam.score}%
                      </span>
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className={`h-2.5 rounded-full ${exam.score >= 90
                          ? "bg-green-500"
                          : exam.score >= 70
                            ? "bg-yellow-500"
                            : "bg-red-500"
                          }`}
                        style={{ width: `${exam.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
