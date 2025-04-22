
import { supabase } from '@/integrations/supabase/client';

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
