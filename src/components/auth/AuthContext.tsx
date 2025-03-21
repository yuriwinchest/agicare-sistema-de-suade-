
import React, { createContext, useContext, useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type User = {
  id: string;
  name: string;
  role: string;
  unit?: string;
  room?: string;
};

type AuthContextType = {
  user: User | null;
  signin: (username: string, password: string) => Promise<boolean>;
  signout: () => void;
  updateUserSettings: (data: Partial<User>) => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user was previously logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const signin = async (username: string, password: string): Promise<boolean> => {
    // In a real app, you would validate credentials with a backend
    // This is a mock implementation
    if (username && password) {
      // Mock successful authentication
      const mockUser = {
        id: "1",
        name: username === "admin" ? "Dr. Ana Silva" : username,
        role: "doctor",
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const signout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const updateUserSettings = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    signin,
    signout,
    updateUserSettings,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const RequireAuth = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
