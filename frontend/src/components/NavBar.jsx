// components/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar({ currentPage, setCurrentPage }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Exams', path: '/exams' },
    { name: 'Profile', path: '/profile' },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Exams', path: '/admin/exams' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Profile', path: '/admin' },
  ];

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  // Determine active link: use currentPage for students, location.pathname for admins
  const isActive = (link) => {
    if (user?.role === 'student') {
      return currentPage === link.name || location.pathname === link.path;
    }
    return location.pathname === link.path;
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Brand and Logo */}
      <div className="flex items-center space-x-3">
        <img src="/STL-Logo-250.png" alt="Logo" className="h-10 w-auto" />
        <span className="text-xl font-bold text-indigo-700">
          {user?.role === 'admin' ? 'Admin Panel' : 'EduStream'}
        </span>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-black hover:text-blue-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Navigation Links and User Info */}
      <div
        className={`flex items-center space-x-6 md:flex ${isMobileMenuOpen ? 'flex flex-col absolute top-16 left-0 w-full bg-white shadow-md p-4' : 'hidden md:flex'
          }`}
      >
        {user ? (
          <>
            <span className="text-black">Welcome, {user.name}</span>
            <div className="flex items-center space-x-6">
              {(user?.role === 'admin' ? adminLinks : studentLinks).map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => {
                    if (user?.role === 'student') {
                      setCurrentPage && setCurrentPage(link.name);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${isActive(link) ? 'text-blue-600 font-semibold' : 'text-black hover:text-blue-600'
                    } transition`}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1 rounded-full hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-6">
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-indigo-700 text-white px-4 py-1 rounded-full hover:bg-indigo-800 transition"
            >
              Login
            </Link>
          </div>
        )}
        {!user && <span className="text-black"></span>}
      </div>
    </nav>
  );
}