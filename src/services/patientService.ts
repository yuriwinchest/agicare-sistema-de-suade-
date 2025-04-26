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

// Define interfaces para objetos de dados aninhados
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
    console.log("Buscando todos os pacientes...");
    
    if (await isDemoMode()) {
      console.log("Modo demo detectado - usando localStorage para pacientes");
      try {
        const storedPatients = localStorage.getItem('demo_patients');
        if (storedPatients) {
          return JSON.parse(storedPatients);
        }
      } catch (error) {
        console.error("Erro ao ler do localStorage:", error);
      }
    }

    // Consulta simplificada para obter pacientes básicos primeiro
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Erro ao buscar pacientes:", error);
      return [];
    }

    console.log(`Encontrados ${patients?.length || 0} pacientes no banco de dados`);

    // Buscar dados adicionais separadamente para evitar erros de junção
    const patientIds = patients?.map(p => p.id) || [];
    let additionalData: Record<string, PatientAdditionalDataType> = {};
    let appointments: Record<string, AppointmentType[]> = {};
    let documents: Record<string, PatientDocumentType[]> = {};
    
    if (patientIds.length > 0) {
      // Buscar dados adicionais
      const { data: patientAdditionalData } = await supabase
        .from('patient_additional_data')
        .select('id, health_plan, specialty')
        .in('id', patientIds);
        
      if (patientAdditionalData) {
        patientAdditionalData.forEach(item => {
          additionalData[item.id] = {
            health_plan: item.health_plan,
            specialty: item.specialty
          };
        });
      }
      
      // Buscar agendamentos
      const { data: patientAppointments } = await supabase
        .from('appointments')
        .select('patient_id, date, time, status')
        .in('patient_id', patientIds);
        
      if (patientAppointments) {
        patientAppointments.forEach(item => {
          if (!appointments[item.patient_id]) {
            appointments[item.patient_id] = [];
          }
          appointments[item.patient_id].push({
            date: item.date,
            time: item.time,
            status: item.status
          });
        });
      }
      
      // Buscar documentos
      const { data: patientDocuments } = await supabase
        .from('patient_documents')
        .select('patient_id, document_type, document_number')
        .in('patient_id', patientIds);
        
      if (patientDocuments) {
        patientDocuments.forEach(item => {
          if (!documents[item.patient_id]) {
            documents[item.patient_id] = [];
          }
          documents[item.patient_id].push({
            document_type: item.document_type,
            document_number: item.document_number
          });
        });
      }
    }

    // Transformar os dados para incluir todos os campos necessários
    const transformedData = patients?.map(patient => {
      const patientAdditionalData = additionalData[patient.id] || {};
      const patientAppointments = appointments[patient.id] || [];
      const patientDocuments = documents[patient.id] || [];
      
      const latestAppointment = patientAppointments.length > 0 ? patientAppointments[0] : {};
      
      return {
        ...patient,
        specialty: patientAdditionalData.specialty || patient.attendance_type || "Não definida",
        professional: patient.father_name || "Não definido",
        health_plan: patientAdditionalData.health_plan || "Não informado",
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
        console.error("Erro ao armazenar no localStorage:", storageError);
      }
    }

    console.log("Pacientes transformados:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("Erro em getAllPatients:", error);
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
      console.error("Erro ao buscar paciente:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro em getPatientById:", error);
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
      console.error("Erro ao buscar pacientes ambulatoriais:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro em getAmbulatoryPatients:", error);
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
      console.error("Erro ao buscar agendamentos ativos:", error);
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
    console.error("Erro em getActiveAppointments:", error);
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
      console.error("Erro ao buscar pacientes internados:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro em getHospitalizedPatients:", error);
    return [];
  }
};
