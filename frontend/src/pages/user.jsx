import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';

const examResults = [
  { name: 'Math', score: 85 },
  { name: 'Science', score: 78 },
  { name: 'History', score: 92 },
  { name: 'English', score: 88 },
  { name: 'Art', score: 95 },
];

const correctAnswersData = [
  { name: 'Math', correct: 42 },
  { name: 'Science', correct: 39 },
  { name: 'History', correct: 46 },
  { name: 'English', correct: 44 },
  { name: 'Art', correct: 48 },
];

const studyTimeData = [
  { name: 'Math', hours: 12 },
  { name: 'Science', hours: 10 },
  { name: 'History', hours: 8 },
  { name: 'English', hours: 11 },
  { name: 'Art', hours: 7 },
];

const upcomingExams = [
  { subject: 'Physics', time: '2025-06-01 10:00 AM', duration: '2h' },
  { subject: 'Chemistry', time: '2025-06-05 1:00 PM', duration: '1.5h' },
];

const pieColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export default function UserDashboard() {
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState('Dashboard');

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Navbar */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Profile Section */}
      <section className="container mx-auto p-6 bg-white mt-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <img
            src="/image.png"
            alt="User Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500"
          />
          <div>
            <h2 className="text-2xl font-semibold">{user?.name || 'Guest'}</h2>
            <p className="text-gray-600">Email: {user?.email || 'N/A'}</p>
            {/* Add Student ID, Grade, Section if available in backend */}
            {/* <p className="text-gray-600">Student ID: 123456</p> */}
            {/* <p className="text-gray-600">Grade: 10</p> */}
            {/* <p className="text-gray-600">Section: A</p> */}
          </div>
        </div>
      </section>

      {/* Bar Chart: Correct Answers */}
      <section className="container mx-auto p-6 mt-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Correct Answers per Subject</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={correctAnswersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="correct" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Bar Chart: Study Time */}
      <section className="container mx-auto p-6 mt-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Time Spent Studying (hrs)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={studyTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="hours" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Pie Chart: Score Distribution */}
      <section className="container mx-auto p-6 mt-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Score Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={examResults}
              dataKey="score"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {examResults.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Area Chart: Performance Trend */}
      <section className="container mx-auto p-6 mt-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Performance Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={examResults}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" />
            <Legend />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      {/* Updated Upcoming Exams with Button */}
      <section className="container mx-auto p-6 mt-6 bg-white rounded-lg shadow mb-10">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">📅 Upcoming Exams</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {upcomingExams.map((exam, index) => {
            const [date, time, meridiem] = exam.time.split(' ');
            return (
              <div
                key={index}
                className="p-6 bg-gradient-to-r from-indigo-50 to-white rounded-xl border border-indigo-100 shadow hover:shadow-md transition"
              >
                <h4 className="text-xl font-bold text-indigo-700 mb-2">{exam.subject}</h4>
                <div className="text-sm text-gray-700 space-y-1 mb-4">
                  <p className="flex items-center gap-2">
                    <span className="text-gray-500">📆</span>
                    <span><strong>Date:</strong> {date}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-gray-500">🕒</span>
                    <span><strong>Time:</strong> {time} {meridiem}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-gray-500">⏱️</span>
                    <span><strong>Duration:</strong> {exam.duration}</span>
                  </p>
                </div>
                <button className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition">
                  Book a Seat
                </button>
              </div>
            );
          })}
        </div>
      </section>
      <Footer />
    </div>
  );
}