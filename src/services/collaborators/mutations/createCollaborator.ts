import { supabase } from '@/integrations/supabase/client';

export interface CollaboratorData {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  department: string;
  role: string; // médico, enfermagem, recepção, etc.
  profile_image?: string;
  status?: boolean;
}

export const createCollaborator = async (collaboratorData: CollaboratorData) => {
  try {
    // Verifica se já existe um colaborador com o mesmo e-mail
    const { data: existingCollaborator } = await supabase
      .from('collaborators')
      .select('*')
      .eq('email', collaboratorData.email)
      .maybeSingle();

    if (existingCollaborator) {
      throw new Error('Já existe um colaborador cadastrado com este e-mail');
    }

    // Insere o novo colaborador
    const { data, error } = await supabase
      .from('collaborators')
      .insert([
        {
          ...collaboratorData,
          created_at: new Date(),
          status: collaboratorData.status ?? true, // Por padrão, o status é ativo
        }
      ])
      .select();

    if (error) {
      console.error("Erro ao criar colaborador:", error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error("Erro detalhado:", error);
    throw error;
  }
}; 