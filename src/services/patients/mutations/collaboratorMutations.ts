
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
      
      if (error.code === "PGRST301") {
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
      
      if (error.code === "PGRST301") {
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
