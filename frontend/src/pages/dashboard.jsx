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
  Legend,
} from "recharts";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

const examResults = [
  { name: "Math", score: 85 },
  { name: "Science", score: 78 },
  { name: "History", score: 92 },
  { name: "English", score: 88 },
  { name: "Art", score: 95 },
];

const correctAnswersData = [
  { name: "Math", correct: 42 },
  { name: "Science", correct: 39 },
  { name: "History", correct: 46 },
  { name: "English", correct: 44 },
  { name: "Art", correct: 48 },
];

const studyTimeData = [
  { name: "Math", hours: 12 },
  { name: "Science", hours: 10 },
  { name: "History", hours: 8 },
  { name: "English", hours: 11 },
  { name: "Art", hours: 7 },
];

const pieColors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];


export default function Dashboard({ currentPage, setCurrentPage }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="container mx-auto p-6 mt-6 bg-white rounded-lg shadow flex-grow">
        {/* Correct Answers Bar Chart */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">
            Correct Answers per Subject
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={correctAnswersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="correct" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Study Time Bar Chart */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">
            Time Spent Studying (hrs)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studyTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Score Distribution Pie Chart */}
        <div className="mb-10">
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
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Trend Area Chart */}
        <div>
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
              <Area
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorScore)"
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </main>

      <Footer />
    </div>
  );
}
