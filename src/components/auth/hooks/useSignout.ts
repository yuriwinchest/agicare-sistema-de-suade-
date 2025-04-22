
import { supabase } from "@/integrations/supabase/client";
import { useNotification } from "@/hooks/useNotification";

export const useSignout = ({
  setUser,
  setIsAuthenticated,
}: {
  setUser: (user: any) => void;
  setIsAuthenticated: (auth: boolean) => void;
}) => {
  const notification = useNotification();

  const signout = async () => {
    try {
      await supabase.auth.signOut();

      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem("user_prefs");

      notification.success("Logout realizado", {
        description: "Você saiu do sistema com sucesso",
      });
    } catch (error) {
      notification.error("Erro ao fazer logout", {
        description: "Ocorreu um erro ao tentar sair do sistema",
      });
    }
  };

  return signout;
};
