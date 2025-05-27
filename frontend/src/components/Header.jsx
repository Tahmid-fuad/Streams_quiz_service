import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-white">Welcome, {user.name}</span>
              <nav>
                <ul className="flex space-x-4">
                  <li><Link to="/" className="hover:text-blue-200">Home</Link></li>
                  <li><Link to="/users" className="hover:text-blue-200">Users</Link></li>
                  <li><Link to="/settings" className="hover:text-blue-200">Settings</Link></li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="hover:text-blue-200"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          ) : (
            <span className="text-white">Not logged in</span>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;