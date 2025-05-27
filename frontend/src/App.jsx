import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import UserDashboard from './pages/user';
import Login from './pages/login';
import Signup from './pages/signup';
import Profile from './pages/profile';
import Dashboard from './pages/dashboard';
import Exams from './pages/exams';
import Admin from './pages/Admin';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/protectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute allowedRole="student" />}>
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/exams" element={<Exams />} />
          </Route>
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;