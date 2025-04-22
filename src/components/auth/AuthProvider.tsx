
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "./AuthContext";
import { useSession } from "@/hooks/useSession";
import { useNotification } from "@/hooks/useNotification";
import { AppUser } from "./types";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, setUser, setIsAuthenticated } = useSession();
  const [showDestinationModal, setShowDestinationModal] = useState<boolean>(false);
  const notification = useNotification();

  const signin = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Tentando login com:", email);
      
      // Handle demo accounts
      if (email === "admin@example.com" && password === "senha123") {
        console.log("Login administrativo bem-sucedido");
        const mockUser: AppUser = {
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
        const mockDoctor: AppUser = {
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

      // Check if the email exists in collaborators table first
      console.log("Verificando se o email existe na tabela de colaboradores...");
      const { data: collaboratorData, error: collaboratorError } = await supabase
        .from('collaborators')
        .select('*')
        .eq('email', email)
        .single();

      if (collaboratorError) {
        console.log("Email não encontrado na tabela de colaboradores:", collaboratorError);
        notification.error("Email não encontrado", {
          description: "Este email não está cadastrado no sistema. Verifique as credenciais ou utilize as contas de demonstração."
        });
        return false;
      }

      // If email exists in collaborators, try Supabase authentication
      console.log("Email encontrado na tabela de colaboradores, tentando autenticação no Supabase");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Erro ao fazer login no Supabase:", error);
        let errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Senha incorreta. Verifique sua senha ou utilize as contas de demonstração.";
        }
        
        notification.error("Erro ao fazer login", {
          description: errorMessage
        });
        return false;
      }

      if (data && data.user) {
        // Fetch collaborator data to get role and other info
        const { data: collaborator } = await supabase
          .from('collaborators')
          .select('*')
          .eq('email', data.user.email)
          .single();
          
        // Create user object
        if (collaborator) {
          const appUser: AppUser = {
            id: data.user.id,
            name: collaborator.name || data.user.email?.split('@')[0] || 'Usuário',
            email: data.user.email || '',
            role: collaborator.role || 'doctor',
          };
          
          setUser(appUser);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(appUser));
          
          // Set destination modal based on role
          setShowDestinationModal(collaborator.role === 'doctor');
          
          notification.success("Login bem-sucedido", {
            description: `Bem-vindo ao sistema Agicare, ${appUser.name}`
          });
        }
        
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

  const updateUserSettings = (data: Partial<AppUser>) => {
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
