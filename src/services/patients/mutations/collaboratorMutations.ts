
import { supabase } from '@/integrations/supabase/client';

export const updateCollaboratorProfile = async (collaboratorId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('collaborators')
      .update(updates)
      .eq('id', collaboratorId)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar perfil do colaborador:", error);
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
    const { error } = await supabase
      .from('collaborators')
      .delete()
      .eq('id', collaboratorId);

    if (error) {
      console.error("Erro ao excluir colaborador:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Erro detalhado ao excluir:", error);
    throw error;
  }
};
