
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
