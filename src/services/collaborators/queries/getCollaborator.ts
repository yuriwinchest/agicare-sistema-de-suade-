
import { supabase } from '@/integrations/supabase/client';

export const getCollaboratorByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('collaborators')
      .select('*')
      .eq('email', email)
      .maybeSingle(); // Changed from single() to maybeSingle()

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
