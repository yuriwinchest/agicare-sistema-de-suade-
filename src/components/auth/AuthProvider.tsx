
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "./AuthContext";
import { useSession } from "@/hooks/useSession";
import { useNotification } from "@/hooks/useNotification";
import { AppUser } from "./types";
import { registerCollaboratorAccount } from "@/services/patients/mutations/collaboratorMutations";
import { DestinationModalProvider } from "./DestinationModalContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, setUser, setIsAuthenticated } = useSession();
  const notification = useNotification();

  const signin = async (email: string, password: string): Promise<{success: boolean, error?: string}> => {
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
        
        notification.success("Login Bem-Sucedido", {
          description: `Bem-vindo ao sistema, ${appUser.name}`
        });
        
        return { success: true };
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
          return { success: false, error: "Este email não está cadastrado no sistema. Verifique suas credenciais." };
        }

        // If email exists in collaborators, try Supabase authentication
        console.log("Email encontrado na tabela de colaboradores, tentando autenticação no Supabase");
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          console.error("Erro ao fazer login no Supabase:", error);
          
          // Check for rate limiting
          if (error.message.includes("For security purposes") || error.status === 429) {
            notification.error("Limite de Taxa Excedido", {
              description: "Por favor, aguarde alguns minutos antes de tentar novamente.",
              duration: 5000
            });
            return { success: false, error: error.message };
          }
          
          if (error.message.includes("Invalid login credentials")) {
            // Check if collaborator exists but auth.user doesn't
            if (collaboratorData) {
              try {
                // Attempt to register the user in auth system if they have a collaborator record
                notification.info("Criando conta de autenticação", {
                  description: "Seu email foi encontrado como colaborador. Criando sua conta de autenticação...",
                  duration: 4000
                });
                
                // Try to create the auth account using the register function from mutations
                const result = await registerCollaboratorAccount(email, password);
                
                if (!result || !result.success) {
                  notification.error("Erro ao configurar conta", {
                    description: "Não foi possível configurar sua conta para login. Entre em contato com o administrador.",
                    duration: 5000
                  });
                  return { success: false, error: "Seu email foi encontrado, mas não está registrado para login. Entre em contato com o administrador do sistema." };
                }
                
                // If signup successful, let them know and then log them in
                notification.success("Conta configurada", {
                  description: "Sua conta foi configurada com sucesso! Você agora está logado.",
                  duration: 5000
                });
                
                // Create user object with data from the registration result
                const appUser: AppUser = {
                  id: result.user?.id || collaboratorData.id,
                  name: collaboratorData.name || email.split('@')[0] || 'Usuário',
                  email: email,
                  role: collaboratorData.role || 'doctor',
                };
                
                setUser(appUser);
                setIsAuthenticated(true);
                localStorage.setItem("user", JSON.stringify(appUser));
                
                return { success: true };
              } catch (registerError: any) {
                console.error("Erro ao registrar usuário:", registerError);
                
                // Handle rate limiting in registration
                if (registerError.message && (registerError.message.includes("For security purposes") || 
                                            registerError.message.includes("rate limit") || 
                                            registerError.status === 429)) {
                  notification.error("Limite de Tentativas Excedido", {
                    description: "Por favor, aguarde alguns minutos antes de tentar novamente.",
                    duration: 5000
                  });
                  return { success: false, error: registerError.message };
                }
                
                if (registerError.message.includes("Conta criada com sucesso")) {
                  // Handle the case where account creation succeeded but automatic login failed
                  notification.warning("Login Manual Necessário", {
                    description: "Sua conta foi criada, mas o login automático falhou. Por favor, tente fazer login novamente.",
                    duration: 6000
                  });
                  return { success: false, error: "Conta criada com sucesso. Por favor, tente fazer login novamente com suas credenciais." };
                }
                
                notification.error("Erro ao criar conta", {
                  description: registerError.message || "Erro ao criar conta de autenticação. Tente novamente mais tarde."
                });
                return { success: false, error: registerError.message };
              }
            } else {
              notification.error("Senha Incorreta", {
                description: "A senha fornecida está incorreta. Por favor, tente novamente."
              });
              return { success: false, error: "A senha fornecida está incorreta. Por favor, tente novamente." };
            }
          } else {
            notification.error("Erro de Autenticação", {
              description: error.message || "Ocorreu um erro inesperado. Entre em contato com o suporte."
            });
            return { success: false, error: error.message };
          }
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
              return { success: false, error: "Erro ao carregar dados do perfil." };
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
              
              notification.success("Login Bem-Sucedido", {
                description: `Bem-vindo ao sistema, ${appUser.name}`
              });
              
              return { success: true };
            } else {
              notification.error("Perfil Não Encontrado", {
                description: "Seu usuário existe mas não tem um perfil associado."
              });
              return { success: false, error: "Seu usuário existe mas não tem um perfil associado." };
            }
          } catch (innerError: any) {
            console.error("Erro ao processar dados do usuário:", innerError);
            notification.error("Erro no Processamento", {
              description: "Ocorreu um erro ao processar seus dados de usuário."
            });
            return { success: false, error: innerError.message };
          }
        }

        return { success: false, error: "Erro desconhecido durante o login." };
      } catch (authError: any) {
        console.error("Erro durante a autenticação:", authError);
        notification.error("Falha na Autenticação", {
          description: "Ocorreu um erro durante o processo de autenticação."
        });
        return { success: false, error: authError.message };
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      notification.error("Erro Inesperado", {
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente."
      });
      return { success: false, error: error.message };
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
  };

  return (
    <AuthContext.Provider value={value}>
      <DestinationModalProvider>
        {children}
      </DestinationModalProvider>
    </AuthContext.Provider>
  );
};
