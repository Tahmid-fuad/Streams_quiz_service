import AdminNavbar from "../components/AdminNavbar";

const students = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    examsGiven: 5,
    subjects: ["Math", "Science", "English"],
    avgMarks: 78,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    examsGiven: 3,
    subjects: ["History", "Art"],
    avgMarks: 85,
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    examsGiven: 6,
    subjects: ["Science", "English", "Geography", "Math"],
    avgMarks: 66,
  },
  {
    id: 4,
    name: "Daisy Khan",
    email: "daisy@example.com",
    examsGiven: 4,
    subjects: ["Biology", "Chemistry"],
    avgMarks: 91,
  },
  {
    id: 5,
    name: "Ethan Lee",
    email: "ethan@example.com",
    examsGiven: 7,
    subjects: ["Physics", "Math", "English"],
    avgMarks: 72,
  },
  {
    id: 6,
    name: "Fiona Garcia",
    email: "fiona@example.com",
    examsGiven: 2,
    subjects: ["History", "Geography"],
    avgMarks: 88,
  },
  {
    id: 7,
    name: "George Patel",
    email: "george@example.com",
    examsGiven: 5,
    subjects: ["Science", "Math", "Art"],
    avgMarks: 81,
  },
  {
    id: 8,
    name: "Hannah Moore",
    email: "hannah@example.com",
    examsGiven: 6,
    subjects: ["English", "Biology", "Chemistry"],
    avgMarks: 69,
  },
  {
    id: 9,
    name: "Ian Turner",
    email: "ian@example.com",
    examsGiven: 3,
    subjects: ["Math", "Physics"],
    avgMarks: 42, // Lower marks
  },
];

export default function AdminUsers() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-50 to-yellow-50">
      <AdminNavbar />
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">👨‍🎓 Student Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 hover:shadow-xl transition-all"
            >
              <h3 className="text-xl font-semibold text-indigo-800 mb-2">{student.name}</h3>
              <p className="text-sm text-gray-600 mb-1">📧 {student.email}</p>
              <p className="text-sm mb-1">📝 <strong>Exams Given:</strong> {student.examsGiven}</p>
              <p className="text-sm mb-1">📚 <strong>Subjects:</strong> {student.subjects.join(", ")}</p>
              <p className="text-sm mb-1">🎯 <strong>Avg Marks:</strong> {student.avgMarks}%</p>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{student.avgMarks}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      student.avgMarks >= 80
                        ? "bg-green-400"
                        : student.avgMarks >= 60
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                    style={{ width: `${student.avgMarks}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
