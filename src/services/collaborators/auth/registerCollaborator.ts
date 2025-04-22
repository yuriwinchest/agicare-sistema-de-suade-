
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export const registerCollaboratorAccount = async (email: string, password: string) => {
  try {
    console.log("Tentando registrar conta para colaborador:", email);
    
    // Check if collaborator exists first
    const { data: collaborator, error: collaboratorError } = await supabase
      .from('collaborators')
      .select('*')
      .eq('email', email)
      .single();
      
    if (collaboratorError) {
      console.error("Colaborador não encontrado com este email:", collaboratorError);
      throw new Error("Colaborador não encontrado com este email");
    }
    
    try {
      // Check if user already exists in auth by trying to sign in
      const { data: existingUserData, error: userCheckError } = await supabase.auth.signInWithPassword({
        email,
        password: 'temp-password-to-check-existence'
      });
      
      const userExists = !userCheckError || 
                         (userCheckError && userCheckError.message.includes("Invalid login credentials"));
      
      if (userExists) {
        console.log("Usuário já existe na autenticação, tentando fazer login direto");
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          if (signInError.message.includes("Invalid login credentials")) {
            throw new Error("Este email já possui uma conta, mas a senha fornecida está incorreta");
          }
          throw signInError;
        }
        
        return {
          success: true,
          user: signInData.user,
          collaborator
        };
      }
      
      // Register the user in the authentication system
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: collaborator.name,
            role: collaborator.role
          }
        }
      });
      
      if (error) {
        handleAuthError(error);
      }
      
      // If registration successful, wait a bit to ensure account is fully created
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try to login automatically after registration
      const loginResult = await attemptAutoLogin(email, password);
      
      return {
        success: true,
        user: loginResult.user || data.user,
        collaborator
      };
      
    } catch (authError: any) {
      handleAuthError(authError);
    }
  } catch (error: any) {
    console.error("Erro ao registrar conta para colaborador:", error);
    throw error;
  }
};

const handleAuthError = (error: any) => {
  if (error.message && (error.message.includes("For security purposes") || 
                        error.status === 429 || 
                        error.code === "over_email_send_rate_limit")) {
    console.error("Erro de limite de taxa:", error);
    throw new Error("Limite de taxa excedido. Por favor, aguarde alguns minutos antes de tentar novamente.");
  }
  
  if (error.message.includes("already registered")) {
    throw error;
  }
  
  throw error;
};

const attemptAutoLogin = async (email: string, password: string) => {
  let loginAttempts = 0;
  const maxAttempts = 3;
  
  while (loginAttempts < maxAttempts) {
    loginAttempts++;
    console.log(`Tentativa de login automático ${loginAttempts} após registro`);
    
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (!result.error) {
        return result.data;
      }
      
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (e) {
      console.error("Erro durante tentativa de login:", e);
    }
  }
  
  throw new Error("Conta criada com sucesso. Por favor, tente fazer login manualmente com suas credenciais.");
};
