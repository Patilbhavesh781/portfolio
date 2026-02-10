import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser, getCurrentUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user from localStorage / token on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    setLoginLoading(true);
    setError(null);
    try {
      const userData = await loginUser(credentials);
      setUser(userData);
      return userData;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
      setError(message);
      throw err;
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setError(null);
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    loginLoading,
    error,
    login,
    logout,
    isAuthenticated,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
