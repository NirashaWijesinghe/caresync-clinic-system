import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("caresync_token");
      const storedUser = localStorage.getItem("caresync_user");

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Validate token with backend
          const res = await API.get("/auth/me");
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem("caresync_user", JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.warn("Session expired or invalid, clearing storage");
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const { user, token } = res.data;
    localStorage.setItem("caresync_token", token);
    localStorage.setItem("caresync_user", JSON.stringify(user));
    setUser(user);
    return user;
  };

  const register = async (userData) => {
    const res = await API.post("/auth/register", userData);
    const { user, token } = res.data;
    localStorage.setItem("caresync_token", token);
    localStorage.setItem("caresync_user", JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("caresync_token");
    localStorage.removeItem("caresync_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
