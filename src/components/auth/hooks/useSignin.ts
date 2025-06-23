import { supabase } from "@/integrations/supabase/client";
import { useNotification } from "@/hooks/useNotification";
import { AppUser } from "../types";
import { z } from "zod";
import { loginSchema } from "@/schemas/loginSchema";

interface UseSigninProps {
  setUser: (user: AppUser | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

export const useSignin = ({ setUser, setIsAuthenticated }: UseSigninProps) => {
  const notification = useNotification();

  const signin = async (values: z.infer<typeof loginSchema>): Promise<void> => {
    try {
      const { username, password } = values;
      console.log("Tentando login com:", username);

            // CREDENCIAIS HARDCODED - Não precisam de banco de dados
      console.log("🔍 Verificando credenciais hardcoded...");
      console.log("Username recebido:", `"${username}"`);
      console.log("Password recebido:", `"${password}"`);

      // Verificar credenciais de administrador especiais
      if (username === "admin@empresa.com" && password === "admin123") {
        console.log("✅ Login de administrador realizado com sucesso (hardcoded)");

        const adminUser: AppUser = {
          id: "admin-special",
          name: "Administrador",
          email: "admin@empresa.com",
          role: "admin",
        };

        setUser(adminUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(adminUser));
        console.log("Estado do usuário atualizado:", adminUser);
        return;
      }

      // Verificar credenciais de teste especiais
      if (username === "teste-colaborador@example.com" && password === "senha123teste") {
        console.log("✅ Login de teste realizado com sucesso (hardcoded)");

        const testUser: AppUser = {
          id: "test-collaborator",
          name: "Colaborador de Teste",
          email: "teste-colaborador@example.com",
          role: "doctor",
        };

        setUser(testUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(testUser));
        console.log("Estado do usuário atualizado:", testUser);
        return;
      }

      // Se chegou até aqui, não são credenciais hardcoded
      console.log("❌ Credenciais não encontradas nas contas hardcoded");
      console.log("Tentando autenticação via Supabase...");

      // Construir o email a partir do username para autenticação normal
      const email = username.includes('@') ? username : `${username}@example.com`;

      // Autenticar com o Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Erro de autenticação no Supabase:", error.message);
        throw new Error("Credenciais inválidas. Verifique email e senha.");
      }

      if (data.user) {
        console.log("✅ Autenticação no Supabase bem-sucedida");

        // Obter dados do usuário
        const { data: userData, error: userError } = await supabase
          .from('collaborators')
          .select('*')
          .eq('email', data.user.email)
          .maybeSingle();

        if (userError) {
          console.error("❌ Erro ao buscar dados do usuário:", userError.message);
          throw new Error("Não foi possível buscar os dados do usuário.");
        }

        // Criar objeto de usuário da aplicação
        const appUser: AppUser = {
          id: data.user.id,
          name: userData?.name || username,
          email: data.user.email || email,
          role: userData?.role || 'user',
        };

        setUser(appUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(appUser));
        console.log("Estado do usuário atualizado:", appUser);
        return;
      }

      throw new Error("Falha na autenticação");
    } catch (error: any) {
      console.error("❌ Erro inesperado no login:", error);
      throw error;
    }
  };

  return { signin };
};
