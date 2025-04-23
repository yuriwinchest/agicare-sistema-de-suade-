
import { format, parse } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "./patients/types";
import { 
  savePatient as savePatientMutation,
  saveCompletePatient as saveCompletePatientMutation,
  saveDraftPatient as saveDraftPatientMutation,
  loadDraftPatient as loadDraftPatientMutation,
  clearDraftPatient as clearDraftPatientMutation,
  confirmPatientAppointment as confirmPatientAppointmentMutation
} from "./patients/patientMutations";

export const formatDateForDatabase = (dateString: string | null): string | null => {
  if (!dateString) return null;
  
  // If already in YYYY-MM-DD format, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  try {
    // Try parsing the date with different possible input formats
    const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
    
    // Check if the parsed date is valid
    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date format:', dateString);
      return null;
    }
    
    // Convert to YYYY-MM-DD format
    return format(parsedDate, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

// Check if we are in development/demo mode
const isDemoMode = async () => {
  try {
    const { data: session } = await supabase.auth.getSession();
    return !session?.session;
  } catch (error) {
    console.error("Error checking session:", error);
    return true; // Default to demo mode on error
  }
};

// Re-export functions from patientMutations.ts with additional authentication check
export const savePatient = async (patient: Patient): Promise<Patient | null> => {
  try {
    // Format birth date correctly if provided
    if (patient.birth_date) {
      patient.birth_date = formatDateForDatabase(patient.birth_date);
    }
    
    // Check authentication status before proceeding
    const { data: session } = await supabase.auth.getSession();
    const isAuthenticated = !!session?.session;
    
    if (!isAuthenticated) {
      console.warn("Usuário não autenticado - tentando criar paciente em modo demo");
      // If in demo mode, create a mock patient
      if (await isDemoMode()) {
        return {
          ...patient,
          id: patient.id || `demo-${Math.random().toString(36).substring(2, 9)}`,
          status: 'Agendado (Demo)'
        };
      }
      throw new Error("Usuário não autenticado");
    }
    
    return await savePatientMutation(patient);
  } catch (error) {
    console.error("Erro em savePatient service layer:", error);
    // Only fallback to demo mode if we're not authenticated but in demo mode
    if (await isDemoMode()) {
      console.log("Creating fallback demo patient");
      return {
        ...patient,
        id: patient.id || `demo-${Math.random().toString(36).substring(2, 9)}`,
        status: 'Agendado (Demo)'
      };
    }
    throw error;
  }
};

export const saveCompletePatient = saveCompletePatientMutation;
export const saveDraftPatient = saveDraftPatientMutation;
export const loadDraftPatient = loadDraftPatientMutation;
export const clearDraftPatient = clearDraftPatientMutation;
export const confirmPatientAppointment = confirmPatientAppointmentMutation;

// Patient retrieval functions
export const getPatientById = async (id: string): Promise<Patient | null> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching patient:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getPatientById:", error);
    return null;
  }
};

export const getAllPatients = async (): Promise<Patient[]> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) {
      console.error("Error fetching patients:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAllPatients:", error);
    return [];
  }
};

export const getAmbulatoryPatients = async (): Promise<Patient[]> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .in('status', ['Aguardando', 'Em Atendimento', 'Enfermagem']);
      
    if (error) {
      console.error("Error fetching ambulatory patients:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAmbulatoryPatients:", error);
    return [];
  }
};

export const getActiveAppointments = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patient:patients(name)')
      .eq('status', 'scheduled')
      .order('date', { ascending: true });
      
    if (error) {
      console.error("Error fetching active appointments:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getActiveAppointments:", error);
    return [];
  }
};

export const getHospitalizedPatients = async (): Promise<Patient[]> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('status', 'Internado');
      
    if (error) {
      console.error("Error fetching hospitalized patients:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getHospitalizedPatients:", error);
    return [];
  }
};
