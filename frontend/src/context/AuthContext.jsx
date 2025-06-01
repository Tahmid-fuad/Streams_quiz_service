import { createContext, useState, useEffect } from "react";
import { authenticateUser } from "../services/api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyAuth(token);
    } else {
      setLoading(false);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const verifyAuth = async (token) => {
    setLoading(true);
    try {
      const userData = await authenticateUser(token); // userData: _id, email, role
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("token", token);
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggingOut(true);
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 1000);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, verifyAuth, logout, loading, isLoggingOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
