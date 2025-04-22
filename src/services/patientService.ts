
import { supabase, Patient } from './supabaseClient';

export const getPatients = async (): Promise<Patient[]> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data.map(patient => ({
      ...patient,
      nursingData: patient.nursing_data ? JSON.parse(patient.nursing_data) : {},
      redirectionTime: patient.redirection_time,
      allergies: patient.allergies || []
    }));
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    return [];
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
    
    if (error) {
      throw error;
    }
    
    return data.map(patient => ({
      ...patient,
      nursingData: patient.nursing_data ? JSON.parse(patient.nursing_data) : {},
      redirectionTime: patient.redirection_time,
      allergies: patient.allergies || []
    }));
  } catch (error) {
    console.error("Erro ao buscar consultas ativas:", error);
    return [];
  }
};

// Alias para manter compatibilidade
export const getActiveAppointments = getActiveAppointmentsAsync;

export const getPatientById = async (id: string): Promise<Patient | null> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) {
      return null;
    }
    
    return {
      ...data,
      nursingData: data.nursing_data ? JSON.parse(data.nursing_data) : {},
      redirectionTime: data.redirection_time,
      allergies: data.allergies || []
    };
  } catch (error) {
    console.error("Erro ao buscar paciente:", error);
    return null;
  }
};

// Alias para manter compatibilidade
export const getPatientByIdAsync = getPatientById;

export const getAmbulatoryPatients = async () => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .in('status', ['Aguardando', 'Enfermagem', 'Em Atendimento'])
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data.map(patient => ({
      ...patient,
      nursingData: patient.nursing_data ? JSON.parse(patient.nursing_data) : {},
      redirectionTime: patient.redirection_time,
      allergies: patient.allergies || []
    }));
  } catch (error) {
    console.error("Erro ao buscar pacientes ambulatoriais:", error);
    return [];
  }
};

export const savePatient = async (patient: any): Promise<Patient> => {
  try {
    // Preparar dados para Supabase
    const supabasePatient = {
      id: patient.id,
      name: patient.name,
      cpf: patient.cpf,
      phone: patient.phone,
      date: patient.date,
      time: patient.time,
      status: patient.status,
      reception: patient.reception,
      specialty: patient.specialty,
      professional: patient.professional,
      observations: patient.observations,
      redirected: patient.redirected || false,
      redirection_time: patient.redirectionTime,
      allergies: patient.allergies || [],
      nursing_data: patient.nursingData ? JSON.stringify(patient.nursingData) : null
    };
    
    const { data, error } = await supabase
      .from('patients')
      .upsert(supabasePatient)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Erro ao salvar paciente:", error);
    throw error;
  }
};

export const saveDraftPatient = (patient: any) => {
  try {
    localStorage.setItem('draftPatient', JSON.stringify(patient));
    return true;
  } catch (error) {
    console.error("Erro ao salvar rascunho do paciente:", error);
    return false;
  }
};

export const loadDraftPatient = () => {
  try {
    const draftData = localStorage.getItem('draftPatient');
    return draftData ? JSON.parse(draftData) : null;
  } catch (error) {
    console.error("Erro ao carregar rascunho do paciente:", error);
    return null;
  }
};

export const clearDraftPatient = () => {
  try {
    localStorage.removeItem('draftPatient');
    return true;
  } catch (error) {
    console.error("Erro ao limpar rascunho do paciente:", error);
    return false;
  }
};

export const updatePatientRedirection = async (patientId: string, destination: string) => {
  try {
    const { error } = await supabase
      .from('patients')
      .update({
        status: destination,
        redirected: true,
        redirection_time: new Date().toISOString()
      })
      .eq('id', patientId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Erro ao atualizar redirecionamento do paciente:", error);
    return false;
  }
};

export const confirmPatientAppointment = async (patientId: string, appointmentData: any) => {
  try {
    const { error } = await supabase
      .from('patients')
      .update({
        status: appointmentData.status,
        specialty: appointmentData.specialty,
        professional: appointmentData.professional,
        observations: appointmentData.observations
      })
      .eq('id', patientId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Erro ao confirmar consulta do paciente:", error);
    return false;
  }
};

export const getHealthProfessionals = async () => {
  try {
    const { data, error } = await supabase
      .from('health_professionals')
      .select('*')
      .eq('active', true)
      .order('name', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar profissionais de saúde:", error);
    return [];
  }
};

export const getAppointmentsForDate = async (date: string) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients:patient_id (name, phone)
      `)
      .eq('date', date)
      .order('time', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar agendamentos para a data:", error);
    return [];
  }
};
