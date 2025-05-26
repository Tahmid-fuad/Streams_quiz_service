import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const examResults = [
  { name: 'Math', score: 85 },
  { name: 'Science', score: 78 },
  { name: 'History', score: 92 },
  { name: 'English', score: 88 },
  { name: 'Art', score: 95 },
];

const upcomingExams = [
  { subject: 'Physics', time: '2025-06-01 10:00 AM', duration: '2h' },
  { subject: 'Chemistry', time: '2025-06-05 1:00 PM', duration: '1.5h' },
];

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src="/STL-Logo-250.png" alt="Logo" className="h-10 w-100" />
          <span className="text-xl font-bold">EduStream</span>
        </div>
        <div className="space-x-6 hidden md:flex">
          <a href="#" className="text-gray-700 hover:text-indigo-600">Dashboard</a>
          <a href="#" className="text-gray-700 hover:text-indigo-600">Exams</a>
          <a href="#" className="text-gray-700 hover:text-indigo-600">Profile</a>
        </div>
      </nav>

      {/* User Info */}
      <section className="container mx-auto p-6 bg-white mt-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-2">Welcome, John Doe</h2>
        <p className="text-gray-600">Student ID: 123456 | Grade: 10 | Section: A</p>
      </section>

      {/* Exam Results Graph */}
      <section className="container mx-auto p-6 mt-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Exam Results</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={examResults}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Upcoming Exams */}
      <section className="container mx-auto p-6 mt-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Upcoming Exams</h3>
        <ul className="space-y-3">
          {upcomingExams.map((exam, index) => (
            <li key={index} className="p-4 bg-gray-50 rounded border flex justify-between items-center">
              <div>
                <h4 className="text-lg font-medium">{exam.subject}</h4>
                <p className="text-gray-600">Time: {exam.time}</p>
              </div>
              <span className="text-sm text-indigo-600 font-semibold">{exam.duration}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
