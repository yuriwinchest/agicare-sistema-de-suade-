
import { supabase } from '@/integrations/supabase/client';

export const registerCollaboratorAccount = async (email: string, password: string) => {
  try {
    console.log("Tentando registrar conta para colaborador:", email);
    
    // Check if collaborator exists first
    const { data: collaborator, error: collaboratorError } = await supabase
      .from('collaborators')
      .select('*')
      .eq('email', email)
      .maybeSingle(); // Changed from single() to maybeSingle()
      
    if (collaboratorError || !collaborator) {
      console.error("Colaborador não encontrado com este email:", collaboratorError || "Nenhum registro encontrado");
      throw new Error("Colaborador não encontrado com este email");
    }
    
    try {
      // Check if user already exists in auth by trying to sign in
      const { data: existingUserData, error: userCheckError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // If login is successful with the provided password, return the user
      if (existingUserData?.user) {
        console.log("Usuário já existe e a senha está correta, login realizado com sucesso");
        return {
          success: true,
          user: existingUserData.user,
          collaborator
        };
      }
      
      // If there's an error, check if it's because the user exists but password is wrong
      if (userCheckError) {
        console.error("Erro ao verificar usuário:", userCheckError.message);
        
        // Check if the error is about invalid credentials
        if (userCheckError.message.includes("Invalid login credentials")) {
          // Verify if the user actually exists by checking with a dummy password
          const { data: userExists } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: false
            }
          });
          
          // If we could send an OTP, it means the user exists
          if (userExists) {
            console.error("Senha incorreta para usuário existente:", email);
            throw new Error("Este email já possui uma conta, mas a senha fornecida está incorreta");
          }
        }
      }
      
      // If we reach here, we'll try to register the user
      console.log("Tentando criar nova conta para:", email);
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
        // Handle specific error for already registered users
        if (error.message.includes("already registered") || error.message.includes("User already registered")) {
          throw new Error("Este email já está registrado. Use a função de recuperação de senha se esqueceu sua senha.");
        }
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
  
  if (error.message.includes("already registered") || 
      error.message.includes("já possui uma conta") || 
      error.message.includes("User already registered")) {
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
