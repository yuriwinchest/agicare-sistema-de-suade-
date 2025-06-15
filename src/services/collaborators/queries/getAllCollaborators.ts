import { supabase } from '@/integrations/supabase/client';

export interface CollaboratorFilters {
  role?: string;
  specialty?: string;
  department?: string;
  status?: boolean;
}

export const getAllCollaborators = async (filters?: CollaboratorFilters) => {
  try {
    let query = supabase
      .from('collaborators')
      .select('*')
      .order('name');
    
    // Aplicar filtros se fornecidos
    if (filters) {
      if (filters.role) {
        query = query.eq('role', filters.role);
      }
      
      if (filters.specialty) {
        query = query.eq('specialty', filters.specialty);
      }
      
      if (filters.department) {
        query = query.eq('department', filters.department);
      }
      
      if (filters.status !== undefined) {
        query = query.eq('status', filters.status);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Erro ao buscar colaboradores:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro detalhado:", error);
    throw error;
  }
}; 