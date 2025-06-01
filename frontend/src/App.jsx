import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import Dashboard from "./pages/dashboard";
import Exams from "./pages/Exams";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminExams from "./pages/AdminExams";
import AdminUsers from "./pages/AdminUsers";
import AdminProfile from "./pages/AdminProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminExamQuestions from "./pages/AdminExamQuestion";
import AccessDenied from "./pages/AccessDenied";
import HomePage from "./pages/home";
import AdminExamDetails from "./components/AdminExamDetails";
import TakeExam from "./pages/ExamPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/access-denied" element={<AccessDenied />} />

          <Route element={<ProtectedRoute allowedRole="student" />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/exampage/:examId" element={<TakeExam />} />
          </Route>

          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route path="/admin" element={<AdminProfile />} />
            <Route path="/admin/exams" element={<AdminExams />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/examquestions" element={<AdminExamQuestions />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/exam/:id" element={<AdminExamDetails />} />
          </Route>

          <Route path="*" element={<AccessDenied />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;