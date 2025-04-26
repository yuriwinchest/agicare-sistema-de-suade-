
import { format, parse } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "./patients/types";
import { 
  savePatient as savePatientMutation,
  saveCompletePatient as saveCompletePatientMutation,
  saveDraftPatient as saveDraftPatientMutation,
  loadDraftPatient as loadDraftPatientMutation,
  clearDraftPatient as clearDraftPatientMutation,
} from "./patients/patientMutations";

// Import the confirmPatientAppointment from the correct path
import { confirmPatientAppointment as confirmPatientAppointmentMutation } from "./patients/mutations/appointmentMutations";

export const formatDateForDatabase = (dateString: string | null): string | null => {
  if (!dateString) return null;
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  try {
    const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
    
    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date format:', dateString);
      return null;
    }
    
    return format(parsedDate, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

const isDemoMode = async () => {
  try {
    const { data: session } = await supabase.auth.getSession();
    return !session?.session;
  } catch (error) {
    console.error("Error checking session:", error);
    return true;
  }
};

export const savePatient = async (patient: Patient): Promise<Patient | null> => {
  try {
    if (patient.birth_date) {
      patient.birth_date = formatDateForDatabase(patient.birth_date);
    }
    
    const { data: session } = await supabase.auth.getSession();
    const isAuthenticated = !!session?.session;
    
    if (!isAuthenticated) {
      console.warn("Usuário não autenticado - tentando criar paciente em modo demo");
      if (await isDemoMode()) {
        return {
          ...patient,
          id: patient.id || `demo-${Math.random().toString(36).substring(2, 9)}`,
          status: 'Agendado (Demo)',
          protocol_number: Math.floor(Math.random() * 900) + 100,
          reception: patient.reception || "RECEPÇÃO CENTRAL",
          specialty: patient.specialty || null,
          professional: patient.professional || null,
          health_plan: patient.healthPlan || null
        };
      }
      throw new Error("Usuário não autenticado");
    }
    
    return await savePatientMutation(patient);
  } catch (error) {
    console.error("Erro em savePatient service layer:", error);
    if (await isDemoMode()) {
      console.log("Creating fallback demo patient");
      return {
        ...patient,
        id: patient.id || `demo-${Math.random().toString(36).substring(2, 9)}`,
        status: 'Agendado',
        protocol_number: Math.floor(Math.random() * 900) + 100,
        specialty: patient.specialty || null,
        professional: patient.professional || null,
        health_plan: patient.healthPlan || null
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
    // Check if in demo mode
    if (await isDemoMode()) {
      console.log("Demo mode detected - using local storage for patients");
      // In demo mode, try to get patients from local storage
      try {
        const storedPatients = localStorage.getItem('demo_patients');
        if (storedPatients) {
          return JSON.parse(storedPatients);
        }
      } catch (error) {
        console.error("Error reading from localStorage:", error);
      }
    }
    
    // Attempt to fetch from Supabase
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching patients:", error);
      return [];
    }
    
    // Store in local storage for demo mode
    if (await isDemoMode() && data) {
      try {
        localStorage.setItem('demo_patients', JSON.stringify(data));
      } catch (storageError) {
        console.error("Error storing in localStorage:", storageError);
      }
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
    // Check if in demo mode
    if (await isDemoMode()) {
      console.log("Demo mode detected - returning mock appointment data");
      // Return mock data for demo purposes
      return [
        {
          id: "1",
          patient: { name: "Maria Silva" },
          date: new Date().toISOString().split('T')[0],
          time: "09:00:00",
          status: "confirmed",
          notes: "Primeira consulta",
          specialty: "Cardiologia",
          professional: "Dr. João Santos",
          health_plan: "Unimed"
        },
        {
          id: "2",
          patient: { name: "Pedro Oliveira" },
          date: new Date().toISOString().split('T')[0],
          time: "10:30:00",
          status: "scheduled",
          notes: "Retorno",
          specialty: "Ortopedia",
          professional: "Dra. Ana Lima",
          health_plan: "SulAmérica"
        }
      ];
    }
    
    // Attempt to fetch from Supabase
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .not('date', 'is', null)
      .order('date', { ascending: true });
      
    if (error) {
      console.error("Error fetching active appointments:", error);
      return [];
    }
    
    // Transform patient data to appointment format
    const appointments = data.map(patient => ({
      id: patient.id,
      patient: { name: patient.name },
      date: patient.date,
      time: patient.appointmentTime,
      status: patient.status === 'Confirmado' ? 'confirmed' : 'scheduled',
      notes: "",
      specialty: patient.specialty || null,
      professional: patient.professional || null,
      health_plan: patient.health_plan || null
    }));
    
    console.log("Transformed appointments:", appointments);
    return appointments || [];
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
