import { Navigate, Outlet } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRole }) {
  const { user, checkToken } = useContext(AuthContext);

  useEffect(() => {
    // Periodically check token validity (e.g., every 5 minutes)
    const interval = setInterval(async () => {
      const validUser = await checkToken();
      if (!validUser) {
        localStorage.removeItem('token');
        window.location.href = '/login'; // Force redirect on invalid token
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [checkToken]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}