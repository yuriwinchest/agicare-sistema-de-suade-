
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
      
      // Special handling for demo accounts
      if (email === "admin@example.com" || email === "doctor@example.com") {
        console.log("Usando conta de demonstração:", email);
        
        // Create user object for demo account
        const role = email === "admin@example.com" ? "admin" : "doctor";
        const name = email === "admin@example.com" ? "Administrador" : "Doutor";
        
        const appUser: AppUser = {
          id: email === "admin@example.com" ? "admin-demo-id" : "doctor-demo-id",
          name: name,
          email: email,
          role: role,
        };
        
        setUser(appUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(appUser));
        
        // Set destination modal for doctor, not for admin
        setShowDestinationModal(role === "doctor");
        
        notification.success("Login Bem-Sucedido", {
          description: `Bem-vindo ao sistema, ${appUser.name}`
        });
        
        return true;
      }
      
      // Regular authentication flow for non-demo accounts
      try {
        // First, check if the email exists in collaborators table
        const { data: collaboratorData, error: collaboratorError } = await supabase
          .from('collaborators')
          .select('*')
          .eq('email', email)
          .single();

        if (collaboratorError) {
          console.log("Email não encontrado na tabela de colaboradores:", collaboratorError);
          notification.error("Erro de Login", {
            description: "Este email não está cadastrado no sistema. Verifique suas credenciais."
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
          
          if (error.message.includes("Invalid login credentials")) {
            // Check if collaborator exists but auth.user doesn't
            if (collaboratorData) {
              // Attempt to register the user in auth system if they have a collaborator record
              notification.info("Conta não configurada", {
                description: "Seu email foi encontrado como colaborador, mas precisa ser configurado para login. Tentando criar sua conta...",
                duration: 4000
              });
              
              // Try to create the auth account
              const { data: signupData, error: signupError } = await supabase.auth.signUp({
                email,
                password,
              });
              
              if (signupError) {
                notification.error("Erro ao configurar conta", {
                  description: "Não foi possível configurar sua conta para login. Entre em contato com o administrador.",
                  duration: 5000
                });
                return false;
              }
              
              // If signup successful, let them know and then log them in
              notification.success("Conta configurada", {
                description: "Sua conta foi configurada com sucesso! Você pode fazer login agora.",
                duration: 5000
              });
              
              // Try logging in again with the new credentials
              const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              
              if (loginError) {
                notification.error("Erro no login após configuração", {
                  description: "Não foi possível fazer login após configurar sua conta. Tente novamente em alguns instantes.",
                  duration: 5000
                });
                return false;
              }
              
              // Continue with login process using the new loginData
              if (loginData && loginData.user) {
                // Create user object
                const appUser: AppUser = {
                  id: loginData.user.id,
                  name: collaboratorData.name || loginData.user.email?.split('@')[0] || 'Usuário',
                  email: loginData.user.email || '',
                  role: collaboratorData.role || 'doctor',
                };
                
                setUser(appUser);
                setIsAuthenticated(true);
                localStorage.setItem("user", JSON.stringify(appUser));
                
                // Set destination modal based on role
                setShowDestinationModal(collaboratorData.role === 'doctor');
                
                notification.success("Login Bem-Sucedido", {
                  description: `Bem-vindo ao sistema, ${appUser.name}`
                });
                
                return true;
              }
              
              return false;
            } else {
              notification.error("Senha Incorreta", {
                description: "A senha fornecida está incorreta. Por favor, tente novamente."
              });
            }
          } else {
            notification.error("Erro de Autenticação", {
              description: "Ocorreu um erro inesperado. Entre em contato com o suporte."
            });
          }
          
          return false;
        }

        if (data && data.user) {
          try {
            // Fetch collaborator data to get role and other info
            const { data: collaborator, error: collabError } = await supabase
              .from('collaborators')
              .select('*')
              .eq('email', data.user.email)
              .single();
              
            if (collabError) {
              console.error("Erro ao buscar dados do colaborador:", collabError);
              notification.error("Erro ao Carregar Perfil", {
                description: "Não foi possível carregar seus dados de perfil."
              });
              return false;
            }
            
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
              
              notification.success("Login Bem-Sucedido", {
                description: `Bem-vindo ao sistema, ${appUser.name}`
              });
              
              return true;
            } else {
              notification.error("Perfil Não Encontrado", {
                description: "Seu usuário existe mas não tem um perfil associado."
              });
              return false;
            }
          } catch (innerError) {
            console.error("Erro ao processar dados do usuário:", innerError);
            notification.error("Erro no Processamento", {
              description: "Ocorreu um erro ao processar seus dados de usuário."
            });
            return false;
          }
        }

        return false;
      } catch (authError) {
        console.error("Erro durante a autenticação:", authError);
        notification.error("Falha na Autenticação", {
          description: "Ocorreu um erro durante o processo de autenticação."
        });
        return false;
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      notification.error("Erro Inesperado", {
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
