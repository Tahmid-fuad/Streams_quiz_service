import { createContext, useState, useEffect } from "react";
import { getRole } from "../services/api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const checkToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return false;
    }

    try {
      const response = await getRole();
      if (response.role && response.email) {
        setUser({ email: response.email, role: response.role });
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      logout();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
  return new Promise((resolve) => {
    setIsLoggingOut(true);
    localStorage.removeItem("token");
    setUser(null);
    setTimeout(() => {
      setIsLoggingOut(false);
      resolve(); // Only resolve after setting flag
    }, 100); // Give a slight delay to ensure ProtectedRoute sees isLoggingOut = true
  });
};

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, checkToken, logout, loading, isLoggingOut }}>
      {children}
    </AuthContext.Provider>
  );
};