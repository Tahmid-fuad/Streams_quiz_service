import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import UserDashboard from './pages/user';
import Login from './components/login';
import Signup from './components/signup';
import Profile from './pages/profile';
import Dashboard from './pages/dashboard';
import Exams from './pages/exams';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserDashboard/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/exams" element={<Exams/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;