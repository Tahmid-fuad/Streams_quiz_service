import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import UserDashboard from './pages/user';
import Login from './pages/login';
import Signup from './pages/signup';
import Admin from './pages/admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/user" element={<UserDashboard/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;