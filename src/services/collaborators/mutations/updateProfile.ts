
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
