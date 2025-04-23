
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

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Evento de autenticação:", event, session ? "Sessão presente" : "Sem sessão");
      
      if (event === 'SIGNED_IN' && session) {
        try {
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData && userData.user) {
            handleUserData(userData.user);
          }
        } catch (error) {
          console.error("Erro ao obter dados do usuário após login:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        handleSignOut();
        setIsLoading(false);
      }
    });
    
    checkExistingSession();
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleUserData = (userData: SupabaseUser) => {
    const appUser: AppUser = {
      id: userData.id,
      name: userData.user_metadata?.name || userData.email?.split('@')[0] || 'Usuário',
      email: userData.email || '',
      role: userData.user_metadata?.role || 'doctor',
    };
    
    setUser(appUser);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(appUser));
  };

  const handleSignOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("user_prefs");
  };

  const checkExistingSession = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData && sessionData.session) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData && userData.user) {
          handleUserData(userData.user);
        }
      } else {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as AppUser;
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
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
