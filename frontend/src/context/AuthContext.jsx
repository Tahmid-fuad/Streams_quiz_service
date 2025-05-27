import { createContext, useState, useEffect } from 'react';
import { checkToken } from '../services/api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check token on app load
    const initializeAuth = async () => {
      const userData = await checkToken();
      if (userData) {
        setUser(userData);
      }
    };
    initializeAuth();

    // Periodic token check (every 5 minutes)
    const interval = setInterval(async () => {
      const userData = await checkToken();
      if (!userData) {
        setUser(null);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, checkToken }}>
      {children}
    </AuthContext.Provider>
  );
};