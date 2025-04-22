
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "./AuthContext";
import { useSession } from "@/hooks/useSession";
import { useNotification } from "@/hooks/useNotification";
import type { User } from "./types";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, setUser, setIsAuthenticated } = useSession();
  const [showDestinationModal, setShowDestinationModal] = useState<boolean>(false);
  const notification = useNotification();

  const signin = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Tentando login com:", email);
      
      // Handle admin login
      if (email === "admin@example.com" && password === "senha123") {
        console.log("Login administrativo bem-sucedido");
        const mockUser = {
          id: "1",
          name: "Dr. Ana Silva",
          email: email,
          role: "admin",
        };

        setUser(mockUser);
        setIsAuthenticated(true);
        setShowDestinationModal(false);
        localStorage.setItem("user", JSON.stringify(mockUser));
        
        notification.success("Login administrativo bem-sucedido", {
          description: "Bem-vindo ao ambiente administrativo Agicare"
        });
        
        return true;
      }

      // Demo doctor account
      if (email === "doctor@example.com" && password === "senha123") {
        console.log("Login do médico demonstrativo bem-sucedido");
        const mockDoctor = {
          id: "2",
          name: "Dr. Carlos Mendes",
          email: email,
          role: "doctor",
        };

        setUser(mockDoctor);
        setIsAuthenticated(true);
        setShowDestinationModal(true);
        localStorage.setItem("user", JSON.stringify(mockDoctor));
        
        notification.success("Login médico bem-sucedido", {
          description: "Bem-vindo ao sistema Agicare, Dr. Carlos"
        });
        
        return true;
      }

      // Handle Supabase authentication
      console.log("Tentando autenticação no Supabase");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Erro ao fazer login no Supabase:", error);
        notification.error("Erro ao fazer login", {
          description: "Credenciais inválidas. Verifique seu email e senha."
        });
        return false;
      }

      if (data && data.user) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      notification.error("Erro inesperado", {
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente."
      });
      return false;
    }
  };

  const signout = async () => {
    try {
      console.log("Realizando logout");
      await supabase.auth.signOut();
      
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem("user_prefs");
      
      notification.success("Logout realizado", {
        description: "Você saiu do sistema com sucesso"
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      notification.error("Erro ao fazer logout", {
        description: "Ocorreu um erro ao tentar sair do sistema"
      });
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
