
import { supabase } from "@/integrations/supabase/client";
import { useNotification } from "@/hooks/useNotification";
import { AppUser } from "../types";
import { registerCollaboratorAccount } from "@/services/collaborators";

interface UseSigninProps {
  setUser: (user: AppUser | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

export const useSignin = ({ setUser, setIsAuthenticated }: UseSigninProps) => {
  const notification = useNotification();

  const signin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (email === "admin@example.com" || email === "doctor@example.com") {
        const role = email === "admin@example.com" ? "admin" : "doctor";
        const name = email === "admin@example.com" ? "Administrador" : "Doutor";
        const appUser: AppUser = {
          id: email === "admin@example.com" ? "admin-demo-id" : "doctor-demo-id",
          name,
          email,
          role,
        };
        setUser(appUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(appUser));
        notification.success("Login Bem-Sucedido", {
          description: `Bem-vindo ao sistema, ${appUser.name}`,
        });
        return { success: true };
      }

      const { data: collaboratorData, error: collaboratorError } = await supabase
        .from("collaborators")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (collaboratorError || !collaboratorData) {
        notification.error("Erro de Login", {
          description: "Este email não está cadastrado no sistema. Verifique suas credenciais.",
        });
        return { success: false, error: "Este email não está cadastrado no sistema. Verifique suas credenciais." };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (
          error.message.includes("For security purposes") ||
          error.status === 429
        ) {
          notification.error("Limite de Taxa Excedido", {
            description: "Por favor, aguarde alguns minutos antes de tentar novamente.",
            duration: 5000,
          });
          return { success: false, error: error.message };
        }

        if (error.message.includes("Invalid login credentials")) {
          // Try registration if collaborator exists but no auth user
          if (collaboratorData) {
            try {
              notification.info("Criando conta de autenticação", {
                description: "Seu email foi encontrado como colaborador. Criando sua conta de autenticação...",
                duration: 4000,
              });

              const result = await registerCollaboratorAccount(email, password);

              if (!result || !result.success) {
                notification.error("Erro ao configurar conta", {
                  description: "Não foi possível configurar sua conta para login. Entre em contato com o administrador.",
                  duration: 5000,
                });
                return {
                  success: false,
                  error: "Seu email foi encontrado, mas não está registrado para login. Entre em contato com o administrador do sistema.",
                };
              }

              notification.success("Conta configurada", {
                description: "Sua conta foi configurada com sucesso! Você agora está logado.",
                duration: 5000,
              });

              const appUser: AppUser = {
                id: result.user?.id || collaboratorData.id,
                name: collaboratorData.name || email.split("@")[0] || "Usuário",
                email,
                role: collaboratorData.role || "doctor",
              };

              setUser(appUser);
              setIsAuthenticated(true);
              localStorage.setItem("user", JSON.stringify(appUser));

              return { success: true };
            } catch (registerError: any) {
              if (
                registerError.message &&
                (registerError.message.includes("For security purposes") ||
                  registerError.message.includes("rate limit") ||
                  registerError.status === 429)
              ) {
                notification.error("Limite de Tentativas Excedido", {
                  description: "Por favor, aguarde alguns minutos antes de tentar novamente.",
                  duration: 5000,
                });
                return { success: false, error: registerError.message };
              }

              if (registerError.message && registerError.message.includes("Conta criada com sucesso")) {
                notification.warning("Login Manual Necessário", {
                  description: "Sua conta foi criada, mas o login automático falhou. Por favor, tente fazer login novamente.",
                  duration: 6000,
                });
                return { success: false, error: "Conta criada com sucesso. Por favor, tente fazer login novamente com suas credenciais." };
              }

              notification.error("Erro ao criar conta", {
                description: registerError.message || "Erro ao criar conta de autenticação. Tente novamente mais tarde.",
              });
              return { success: false, error: registerError.message };
            }
          } else {
            notification.error("Senha Incorreta", {
              description: "A senha fornecida está incorreta. Por favor, tente novamente.",
            });
            return { success: false, error: "A senha fornecida está incorreta. Por favor, tente novamente." };
          }
        } else {
          notification.error("Erro de Autenticação", {
            description: error.message || "Ocorreu um erro inesperado. Entre em contato com o suporte.",
          });
          return { success: false, error: error.message };
        }
      }

      if (data && data.user) {
        try {
          const { data: collaborator, error: collabError } = await supabase
            .from("collaborators")
            .select("*")
            .eq("email", data.user.email)
            .maybeSingle();

          if (collabError) {
            notification.error("Erro ao Carregar Perfil", {
              description: "Não foi possível carregar seus dados de perfil.",
            });
            return { success: false, error: "Erro ao carregar dados do perfil." };
          }

          if (collaborator) {
            const appUser: AppUser = {
              id: data.user.id,
              name: collaborator.name || data.user.email?.split("@")[0] || "Usuário",
              email: data.user.email || "",
              role: collaborator.role || "doctor",
            };

            setUser(appUser);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(appUser));

            notification.success("Login Bem-Sucedido", {
              description: `Bem-vindo ao sistema, ${appUser.name}`,
            });

            return { success: true };
          } else {
            // Basic profile if no collaborator
            const appUser: AppUser = {
              id: data.user.id,
              name: data.user.email?.split("@")[0] || "Usuário",
              email: data.user.email || "",
              role: "user",
            };

            setUser(appUser);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(appUser));

            notification.success("Login Bem-Sucedido", {
              description: `Bem-vindo ao sistema, ${appUser.name}`,
            });

            return { success: true };
          }
        } catch (innerError: any) {
          notification.error("Erro no Processamento", {
            description: "Ocorreu um erro ao processar seus dados de usuário.",
          });
          return { success: false, error: innerError.message };
        }
      }

      return { success: false, error: "Erro desconhecido durante o login." };
    } catch (error: any) {
      notification.error("Erro Inesperado", {
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
      });
      return { success: false, error: error.message };
    }
  };

  return signin;
};

