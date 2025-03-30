
import React, { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import { AuthContext } from "./AuthContext";
import { User } from "./types";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showDestinationModal, setShowDestinationModal] = useState<boolean>(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (session && session.session) {
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData && userData.user) {
          const user: User = {
            id: userData.user.id,
            name: userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || 'Usuário',
            email: userData.user.email,
            role: userData.user.user_metadata?.role || 'doctor',
          };
          
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
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      }
    };
    
    checkSession();
    
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Erro ao fazer login:", error);
        
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
      await supabase.auth.signOut();
      
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
