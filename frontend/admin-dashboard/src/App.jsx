import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import UserDashboard from './pages/user';
import Login from './components/login';
import Signup from './components/signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserDashboard/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;