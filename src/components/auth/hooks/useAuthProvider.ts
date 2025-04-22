
import { useSession } from "@/hooks/useSession";
import { useSignin } from "./useSignin";
import { useSignout } from "./useSignout";
import { useUserSettings } from "./useUserSettings";

/**
 * Centraliza a lógica de autenticação para o AuthProvider.
 */
export const useAuthProvider = () => {
  const { user, isAuthenticated, setUser, setIsAuthenticated } = useSession();
  const signin = useSignin({ setUser, setIsAuthenticated });
  const signout = useSignout({ setUser, setIsAuthenticated });
  const updateUserSettings = useUserSettings({ user, setUser });

  return {
    user,
    isAuthenticated,
    signin,
    signout,
    updateUserSettings,
  };
};
