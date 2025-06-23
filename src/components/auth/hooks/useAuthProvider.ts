import { useSession } from "@/hooks/useSession";
import { useSignin } from "./useSignin";
import { useSignout } from "./useSignout";
import { useUserSettings } from "./useUserSettings";

/**
 * Centraliza a lógica de autenticação para o AuthProvider.
 */
export const useAuthProvider = () => {
  const { user, isAuthenticated, isLoading, setUser, setIsAuthenticated } = useSession();
  const signinHook = useSignin({ setUser, setIsAuthenticated });
  const signout = useSignout({ setUser, setIsAuthenticated });
  const updateUserSettings = useUserSettings({ user, setUser });

  // Adaptar o signin para a interface esperada
  const signin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("useAuthProvider - signin chamado com:", email);
      await signinHook.signin({ username: email, password });
      console.log("useAuthProvider - signin bem-sucedido");
      return { success: true };
    } catch (error: any) {
      console.error("useAuthProvider - erro no signin:", error.message);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    signin,
    signout,
    updateUserSettings,
  };
};
