import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ScatterChart, Scatter, ZAxis
} from "recharts";
import AdminNavbar from "../components/AdminNavbar";

const streamData = [
  { stream: "Science", students: 120 },
  { stream: "Commerce", students: 90 },
  { stream: "Arts", students: 70 },
];

const marksData = [
  { subject: "Math", avg: 75 },
  { subject: "Science", avg: 82 },
  { subject: "History", avg: 68 },
  { subject: "English", avg: 80 },
];

const examsOverTime = [
  { month: "Jan", exams: 5 },
  { month: "Feb", exams: 9 },
  { month: "Mar", exams: 7 },
  { month: "Apr", exams: 11 },
];

const resultRatio = [
  { name: "Passed", value: 320 },
  { name: "Failed", value: 80 },
];

const mcqsData = [
  { subject: "Math", count: 30 },
  { subject: "Science", count: 24 },
  { subject: "English", count: 18 },
  { subject: "History", count: 20 },
];

const scatterData = [
  { score: 50, students: 10 },
  { score: 60, students: 25 },
  { score: 70, students: 40 },
  { score: 80, students: 30 },
  { score: 90, students: 15 },
];

const COLORS = ["#10B981", "#EF4444"];
const RADAR_COLORS = ["#F97316", "#6366F1", "#EAB308", "#EC4899"];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 to-pink-50">
      <AdminNavbar />
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">📊 Admin Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Bar Chart */}
          <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-purple-700">🎓 Students per Stream</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={streamData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stream" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#A78BFA" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-gradient-to-br from-green-100 to-teal-100 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-green-800">📈 Avg Marks per Subject</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marksData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avg" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Area Chart */}
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800">🗓️ Exams Completed Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={examsOverTime}>
                <defs>
                  <linearGradient id="colorExams" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="exams" stroke="#EA580C" fillOpacity={1} fill="url(#colorExams)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-gradient-to-br from-red-100 to-pink-100 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-red-800">✅ Pass / ❌ Fail Ratio</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resultRatio}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {resultRatio.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="bg-gradient-to-br from-blue-100 to-sky-100 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">📘 MCQs per Subject</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={mcqsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar name="MCQs" dataKey="count" stroke="#3B82F6" fill="#60A5FA" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Scatter Chart */}
          <div className="bg-gradient-to-br from-pink-100 to-fuchsia-100 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-pink-700">📊 Score Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid />
                <XAxis type="number" dataKey="score" name="Score" />
                <YAxis type="number" dataKey="students" name="Students" />
                <ZAxis range={[100]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Scores" data={scatterData} fill="#EC4899" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
}
