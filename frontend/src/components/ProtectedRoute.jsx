import { Navigate, Outlet } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getRole } from '../services/api/auth';

export default function ProtectedRoute({ allowedRole }) {
  const { user, checkToken, logout, loading, isLoggingOut } = useContext(AuthContext);

  useEffect(() => {
    const validateRole = async () => {
      if (!user) return; // 🔐 Don't run if user is already null (e.g., after logout)

      try {
        const response = await getRole();
        if (response.role !== allowedRole) {
          logout();
          window.location.href = '/access-denied';
        }
      } catch (error) {
        logout();
        window.location.href = '/access-denied';
      }
    };

    if (!loading && user) {
      validateRole();
    }
  }, [user, logout, allowedRole, loading]);


  useEffect(() => {
    const interval = setInterval(async () => {
      if (!user) return; // Don't check if already logged out

      const validUser = await checkToken();
      if (!validUser && !isLoggingOut) {
        logout();
        window.location.href = '/access-denied';
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkToken, logout, isLoggingOut, user]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return isLoggingOut ? <Navigate to="/login" replace /> : <Navigate to="/access-denied" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}