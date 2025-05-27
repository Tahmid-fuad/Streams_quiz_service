import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar({ currentPage, setCurrentPage }) {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Define links for students
  const studentLinks = ['Dashboard', 'Exams', 'Profile'];
  // Define links for admins (minimal, can be customized)
  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin' },
  ];

  // Determine styles based on role
  const navStyles = user?.role === 'admin'
    ? 'bg-blue-600 text-white'
    : 'bg-white shadow-md text-gray-700';
  const linkStyles = user?.role === 'admin'
    ? 'hover:text-blue-200'
    : 'hover:text-indigo-600';
  const activeLinkStyles = user?.role === 'admin'
    ? 'text-blue-200 font-semibold'
    : 'text-indigo-600 font-semibold';

  return (
    <nav className={`py-4 px-6 flex justify-between items-center ${navStyles}`}>
      <div className="flex items-center space-x-3">
        <img src="/STL-Logo-250.png" alt="Logo" className="h-10 w-100" />
        <span className="text-xl font-bold">
          {user?.role === 'admin' ? 'Admin Dashboard' : 'EduStream'}
        </span>
      </div>
      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <span className={user?.role === 'admin' ? 'text-white' : 'text-gray-700'}>
              Welcome, {user.name}
            </span>
            <div className="space-x-6 hidden md:flex">
              {user.role === 'admin' ? (
                adminLinks.map(link => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`${
                      currentPage === link.name ? activeLinkStyles : linkStyles
                    } transition`}
                  >
                    {link.name}
                  </Link>
                ))
              ) : (
                studentLinks.map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`${
                      currentPage === page ? activeLinkStyles : linkStyles
                    } transition`}
                  >
                    {page}
                  </button>
                ))
              )}
              <button
                onClick={handleLogout}
                className={`${linkStyles} transition`}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <span className={user?.role === 'admin' ? 'text-white' : 'text-gray-700'}>
            Not logged in
          </span>
        )}
      </div>
    </nav>
  );
}