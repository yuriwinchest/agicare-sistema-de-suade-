
import React, { createContext, useContext, useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";

type User = {
  id: string;
  name: string;
  role: string;
  unit?: string;
  room?: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  signin: (email: string, password: string) => Promise<boolean>;
  signout: () => Promise<void>;
  updateUserSettings: (data: Partial<User>) => void;
  isAuthenticated: boolean;
  showDestinationModal: boolean;
  setShowDestinationModal: (show: boolean) => void;
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
  const [showDestinationModal, setShowDestinationModal] = useState<boolean>(false);

  // Check if user was previously logged in
  useEffect(() => {
    const checkSession = async () => {
      // Check Supabase session first
      const { data: session } = await supabase.auth.getSession();
      
      if (session && session.session) {
        // Get user data from Supabase
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData && userData.user) {
          // Try to get additional profile data from a profile table if you have one
          // Or just use the basic data from auth
          const user = {
            id: userData.user.id,
            name: userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || 'Usuário',
            email: userData.user.email,
            role: userData.user.user_metadata?.role || 'doctor',
          };
          
          // Check if we have stored local preferences
          const storedPrefs = localStorage.getItem("user_prefs");
          if (storedPrefs) {
            const prefs = JSON.parse(storedPrefs);
            user.unit = prefs.unit;
            user.room = prefs.room;
          }
          
          setUser(user);
          setIsAuthenticated(true);
        }
      } else {
        // Fallback to local storage for development/demo
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData && userData.user) {
          const user: User = {
            id: userData.user.id,
            name: userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || 'Usuário',
            email: userData.user.email || '',
            role: userData.user.user_metadata?.role || 'doctor',
          };
          
          setUser(user);
          setIsAuthenticated(true);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signin = async (email: string, password: string): Promise<boolean> => {
    try {
      // Try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Erro ao fazer login:", error);
        
        // Fallback to mock authentication for development/demo
        if (email && password) {
          const mockUser = {
            id: "1",
            name: email === "admin@example.com" ? "Dr. Ana Silva" : email.split('@')[0],
            email: email,
            role: "doctor",
          };

          setUser(mockUser);
          setIsAuthenticated(true);
          setShowDestinationModal(true);
          localStorage.setItem("user", JSON.stringify(mockUser));
          return true;
        }
        
        return false;
      }
      
      // Successfully authenticated with Supabase
      if (data && data.user) {
        const user = {
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Usuário',
          email: data.user.email,
          role: data.user.user_metadata?.role || 'doctor',
        };
        
        setUser(user);
        setIsAuthenticated(true);
        setShowDestinationModal(true);
        localStorage.setItem("user", JSON.stringify(user));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  };

  const signout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear local storage and state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem("user_prefs");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const updateUserSettings = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Store unit/room preferences separately
      const prefs = {
        unit: updatedUser.unit,
        room: updatedUser.room,
      };
      localStorage.setItem("user_prefs", JSON.stringify(prefs));
    }
  };

  const value = {
    user,
    signin,
    signout,
    updateUserSettings,
    isAuthenticated,
    showDestinationModal,
    setShowDestinationModal,
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
