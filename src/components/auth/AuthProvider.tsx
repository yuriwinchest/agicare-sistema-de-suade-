
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "./AuthContext";
import { User } from "./types";
import { useToast } from "@/hooks/use-toast";
import { useNotification } from "@/hooks/useNotification";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showDestinationModal, setShowDestinationModal] = useState<boolean>(false);
  const { toast } = useToast();
  const notification = useNotification();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Evento de autenticação:", event, session ? "Sessão presente" : "Sem sessão");
      
      if (event === 'SIGNED_IN' && session) {
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData && userData.user) {
          const user: User = {
            id: userData.user.id,
            name: userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || 'Usuário',
            email: userData.user.email || '',
            role: userData.user.user_metadata?.role || 'doctor',
          };
          
          setUser(user);
          setIsAuthenticated(true);
          
          toast({
            title: "Login realizado com sucesso",
            description: `Bem-vindo, ${user.name}!`,
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    
    // THEN check for existing session
    const checkSession = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData && sessionData.session) {
          console.log("Sessão encontrada:", sessionData.session);
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData && userData.user) {
            console.log("Usuário autenticado:", userData.user);
            const user: User = {
              id: userData.user.id,
              name: userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || 'Usuário',
              email: userData.user.email || '',
              role: userData.user.user_metadata?.role || 'doctor',
            };
            
            const storedPrefs = localStorage.getItem("user_prefs");
            if (storedPrefs) {
              const prefs = JSON.parse(storedPrefs);
              user.unit = prefs.unit;
              user.room = prefs.room;
            }
            
            setUser(user);
            setIsAuthenticated(true);
          }
        } else {
          console.log("Nenhuma sessão ativa encontrada, verificando usuário armazenado");
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            console.log("Usuário armazenado encontrado");
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      }
    };
    
    checkSession();
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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

      // Demo doctor account for testing
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
      console.log("Tentando autenticação no Supabase com:", email);
      
      // Try Supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro ao fazer login no Supabase:", error);
        
        // For demo purposes: If Supabase auth fails, still allow mock login
        if (email.includes('@') && password.length >= 6) {
          console.log("Criando usuário mockado após falha na autenticação do Supabase");
          const mockUser = {
            id: Math.random().toString(36).substring(2, 11),
            name: email.split('@')[0],
            email: email,
            role: "doctor",
          };

          setUser(mockUser);
          setIsAuthenticated(true);
          setShowDestinationModal(true);
          localStorage.setItem("user", JSON.stringify(mockUser));
          
          notification.info("Login com credenciais mockadas", {
            description: "Conectado com perfil de demonstração"
          });
          
          return true;
        }
        
        notification.error("Falha na autenticação", {
          description: "Credenciais inválidas. Verifique seu email e senha."
        });
        return false;
      }

      if (data && data.user) {
        console.log("Login no Supabase bem-sucedido:", data.user);
        const user = {
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Usuário',
          email: data.user.email || '',
          role: data.user.user_metadata?.role || 'doctor',
        };

        setUser(user);
        setIsAuthenticated(true);
        setShowDestinationModal(user.role !== "admin");
        localStorage.setItem("user", JSON.stringify(user));
        
        notification.success("Login bem-sucedido", {
          description: `Bem-vindo, ${user.name}!`
        });
        
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
      
      toast({
        title: "Logout realizado",
        description: "Você saiu do sistema com sucesso",
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar sair do sistema",
        variant: "destructive",
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
