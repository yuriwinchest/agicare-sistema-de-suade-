
import { supabase } from '@/integrations/supabase/client';

export const updateCollaboratorProfile = async (collaboratorId: string, updates: any) => {
  try {
    console.log("Atualizando perfil do colaborador:", collaboratorId);
    const { data, error } = await supabase
      .from('collaborators')
      .update({
        name: updates.name,
        role: updates.role,
        image_url: updates.image_url,
        email: updates.email,
        phone: updates.phone,
        specialty: updates.specialty,
        department: updates.department,
        active: updates.active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', collaboratorId)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar perfil do colaborador:", error);
      
      if (error.code === "PGRST301" || error.message.includes("violates row-level security")) {
        throw new Error("Você não tem permissão para atualizar este colaborador");
      }
      
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erro detalhado:", error);
    throw error;
  }
};

export const deleteCollaborator = async (collaboratorId: string) => {
  try {
    console.log("Excluindo colaborador:", collaboratorId);
    const { error } = await supabase
      .from('collaborators')
      .delete()
      .eq('id', collaboratorId);

    if (error) {
      console.error("Erro ao excluir colaborador:", error);
      
      if (error.code === "PGRST301" || error.message.includes("violates row-level security")) {
        throw new Error("Você não tem permissão para excluir este colaborador");
      }
      
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Erro detalhado ao excluir:", error);
    throw error;
  }
};

export const getCollaboratorByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('collaborators')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error("Erro ao buscar colaborador por email:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erro detalhado:", error);
    throw error;
  }
};

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
      // Check if user already exists in auth
      const { data: existingUser, error: userCheckError } = await supabase.auth.admin.getUserByEmail(email);
      
      if (!userCheckError && existingUser) {
        console.log("Usuário já existe na autenticação, tentando fazer login direto");
        // User already exists, try to sign in
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
        console.error("Erro ao registrar usuário:", error);
        
        // Handle rate limiting error
        if (error.message.includes("For security purposes") || error.status === 429) {
          throw new Error("Limite de taxa excedido. Por favor, aguarde alguns minutos antes de tentar novamente.");
        }
        
        if (error.message.includes("already registered")) {
          // Try to sign in directly instead of registering
          console.log("Email já registrado, tentando fazer login direto");
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
        
        throw error;
      }
      
      // If registration successful, wait a bit to ensure account is fully created
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try to login automatically after registration
      let loginAttempts = 0;
      const maxAttempts = 3;
      let signInData = null;
      let signInError = null;
      
      while (loginAttempts < maxAttempts) {
        loginAttempts++;
        console.log(`Tentativa de login automático ${loginAttempts} após registro`);
        
        try {
          const result = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          signInData = result.data;
          signInError = result.error;
          
          if (!signInError) {
            // Login successful
            break;
          }
          
          // If login error, wait a bit before trying again
          await new Promise(resolve => setTimeout(resolve, 800));
        } catch (e) {
          console.error("Erro durante tentativa de login:", e);
          signInError = e;
        }
      }
      
      if (signInError) {
        console.error("Não foi possível fazer login automático após múltiplas tentativas:", signInError);
        throw new Error("Conta criada com sucesso. Por favor, tente fazer login manualmente com suas credenciais.");
      }
      
      return {
        success: true,
        user: signInData.user || data.user,
        collaborator
      };
      
    } catch (authError: any) {
      // Check for rate limiting error in all cases
      if (authError.message && (authError.message.includes("For security purposes") || 
                              authError.status === 429 || 
                              authError.code === "over_email_send_rate_limit")) {
        console.error("Erro de limite de taxa:", authError);
        throw new Error("Limite de taxa excedido. Por favor, aguarde alguns minutos antes de tentar novamente.");
      }
      
      // Re-throw other errors
      throw authError;
    }
  } catch (error: any) {
    console.error("Erro ao registrar conta para colaborador:", error);
    throw error;
  }
};
