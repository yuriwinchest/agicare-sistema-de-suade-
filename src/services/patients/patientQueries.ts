
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "./types";

export const getPatients = async (): Promise<Patient[]> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    return [];
  }
};

export const getPatientById = async (id: string): Promise<Patient | null> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) return null;
    return data;
  } catch (error) {
    console.error("Erro ao buscar paciente:", error);
    return null;
  }
};

export const getActiveAppointmentsAsync = async () => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or('status.neq.Atendido,status.neq.Medicação,status.neq.Observação,status.neq.Alta,status.neq.Internação')
      .eq('redirected', false)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao buscar consultas ativas:", error);
    return [];
  }
};

export const getAmbulatoryPatients = async () => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .in('status', ['Aguardando', 'Enfermagem', 'Em Atendimento'])
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao buscar pacientes ambulatoriais:", error);
    return [];
  }
};
