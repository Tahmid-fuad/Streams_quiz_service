import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRole }) {
  const { user, verifyAuth, logout, loading, isLoggingOut } =
    useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const validateRole = () => {
      console.log(user);
      if (user.role !== allowedRole) {
        logout();
        navigate("/access-denied", { replace: true });
        return;
      }
    };

    if (!loading && user) {
      validateRole();
    }
  }, [user, logout, allowedRole, loading]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!user) return; // Don't check if already logged out

      const validUser = await verifyAuth(localStorage.getItem("token"));
      if (!validUser && !isLoggingOut) {
        logout();
        window.location.href = "/access-denied";
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [verifyAuth, logout, isLoggingOut, user]);

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
    return isLoggingOut ? (
      <Navigate to="/login" replace />
    ) : (
      <Navigate to="/access-denied" replace />
    );
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}
