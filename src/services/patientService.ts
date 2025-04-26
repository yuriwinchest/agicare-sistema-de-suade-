
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

export const savePatient = savePatientMutation;
export const saveCompletePatient = saveCompletePatientMutation;
export const saveDraftPatient = saveDraftPatientMutation;
export const loadDraftPatient = loadDraftPatientMutation;
export const clearDraftPatient = clearDraftPatientMutation;
export const confirmPatientAppointment = confirmPatientAppointmentMutation;

// Define interfaces for nested data objects to fix TypeScript errors
interface PatientAdditionalDataType {
  health_plan?: string | null;
  specialty?: string | null;
}

interface AppointmentType {
  date?: string | null;
  time?: string | null;
  status?: string | null;
}

interface PatientDocumentType {
  document_type?: string;
  document_number?: string;
}

export const getAllPatients = async (): Promise<Patient[]> => {
  try {
    if (await isDemoMode()) {
      console.log("Demo mode detected - using local storage for patients");
      try {
        const storedPatients = localStorage.getItem('demo_patients');
        if (storedPatients) {
          return JSON.parse(storedPatients);
        }
      } catch (error) {
        console.error("Error reading from localStorage:", error);
      }
    }

    // Simplificar a consulta para evitar o erro com a coluna "reception"
    const { data: patients, error } = await supabase
      .from('patients')
      .select(`
        *,
        patient_additional_data (
          health_plan,
          specialty
        ),
        appointments (
          date,
          time,
          status,
          professional_id
        ),
        patient_documents (
          document_type,
          document_number
        )
      `)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching patients:", error);
      return [];
    }

    // Transform the data to include all required fields
    const transformedData = patients?.map(patient => {
      // Use type assertions and proper null handling for nested objects
      const additionalData = patient.patient_additional_data?.[0] as PatientAdditionalDataType || {};
      const latestAppointment = patient.appointments?.[0] as AppointmentType || {};
      const documentData = patient.patient_documents?.[0] as PatientDocumentType || {};

      return {
        ...patient,
        specialty: additionalData.specialty || patient.attendance_type || "Não definida",
        professional: patient.father_name || "Não definido",
        health_plan: additionalData.health_plan || "Não informado",
        reception: "RECEPÇÃO CENTRAL", // Valor padrão pois a coluna não existe
        date: latestAppointment.date || null,
        appointmentTime: latestAppointment.time || null,
        status: patient.status || 'Pendente'
      };
    }) || [];

    if (await isDemoMode() && transformedData) {
      try {
        localStorage.setItem('demo_patients', JSON.stringify(transformedData));
      } catch (storageError) {
        console.error("Error storing in localStorage:", storageError);
      }
    }

    return transformedData;
  } catch (error) {
    console.error("Error in getAllPatients:", error);
    return [];
  }
};

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
    if (await isDemoMode()) {
      console.log("Demo mode detected - returning mock appointment data");
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

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .not('birth_date', 'is', null)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching active appointments:", error);
      return [];
    }

    console.log("Raw patient data from Supabase:", data);

    const appointments = data.map(patient => ({
      id: patient.id,
      patient: { name: patient.name },
      date: patient.birth_date,
      time: "09:00:00",
      status: patient.status === 'Confirmado' ? 'confirmed' : 'scheduled',
      notes: "",
      specialty: patient.attendance_type || "Não informada", 
      professional: patient.father_name || "Não informado",
      health_plan: "Não informado"
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
