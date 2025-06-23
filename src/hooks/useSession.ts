import { useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNotification } from './useNotification';
import { AppUser } from '@/components/auth/types';

export const useSession = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const notification = useNotification();

  // Verificar se há um usuário no localStorage ao inicializar
  useEffect(() => {
    const storedUserStr = localStorage.getItem("user");
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        console.log("Usuário encontrado no localStorage:", storedUser);
        setUser(storedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Erro ao parsear usuário do localStorage:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    // First set up the auth listener to react to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event, session ? "Session present" : "No session");

      if (event === 'SIGNED_IN' && session) {
        try {
          const { data: userData } = await supabase.auth.getUser();

          if (userData && userData.user) {
            handleUserData(userData.user);
          }
        } catch (error) {
          console.error("Error getting user data after login:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        handleSignOut();
        setIsLoading(false);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed successfully");
      }
    });

    // Then check for existing session after setting up listener
    checkExistingSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleUserData = (userData: SupabaseUser) => {
    console.log("Processando dados do usuário:", userData);
    const appUser: AppUser = {
      id: userData.id,
      name: userData.user_metadata?.name || userData.email?.split('@')[0] || 'Usuário',
      email: userData.email || '',
      role: userData.user_metadata?.role || 'doctor',
    };

    setUser(appUser);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(appUser));
    console.log("User authenticated:", appUser);
  };

  const handleSignOut = () => {
    console.log("Realizando logout do usuário");
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("user_prefs");
    console.log("User signed out");
  };

  const checkExistingSession = async () => {
    try {
      console.log("Checking for existing session...");
      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData && sessionData.session) {
        console.log("Existing session found");
        const { data: userData } = await supabase.auth.getUser();
        if (userData && userData.user) {
          handleUserData(userData.user);
        }
      } else {
        console.log("No existing session found");
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          console.log("Found user in localStorage, but no active session");
          try {
            // Verificar se temos um usuário especial de admin
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.email === "admin@empresa.com") {
              console.log("Usuário admin especial encontrado no localStorage, mantendo autenticação");
              setUser(parsedUser);
              setIsAuthenticated(true);
            } else {
              // Se não for o admin especial, limpar o localStorage
              localStorage.removeItem("user");
              localStorage.removeItem("user_prefs");
            }
          } catch (error) {
            console.error("Erro ao parsear usuário do localStorage:", error);
            localStorage.removeItem("user");
            localStorage.removeItem("user_prefs");
          }
        }
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setIsAuthenticated,
  };
};
