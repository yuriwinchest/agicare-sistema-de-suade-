import { Patient, HospitalizedPatient, PatientAdditionalData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { formatDateForDatabase, ensureProperDateFormat } from "../utils/dateUtils";

export const getPatientById = async (id: string): Promise<Patient | null> => {
  try {
    // First get basic patient data
    const { data: patientData, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching patient:", error);
      return null;
    }
    
    if (!patientData) {
      return null;
    }

    // Then get patient additional data
    const { data: additionalData } = await supabase
      .from('patient_additional_data')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    // Get the most recent appointment for this patient
    const { data: appointmentData } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', id)
      .order('date', { ascending: false })
      .order('time', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    console.log("Patient data:", patientData);
    console.log("Additional data:", additionalData);
    console.log("Appointment data:", appointmentData);
    
    // Combine the data with safe access to properties
    const additionalDataAny = additionalData as any || {};
    
    const fullPatientData: Patient = {
      ...patientData,
      // Use safe optional chaining and fallbacks
      specialty: additionalDataAny.specialty || (appointmentData?.specialty) || patientData.attendance_type || "Não definida",
      professional: additionalDataAny.professional || (appointmentData?.doctor_id ? "Dr." + appointmentData.doctor_id.slice(0, 5) : null) || patientData.father_name || "Não definido",
      health_plan: additionalDataAny.health_plan || "Não informado",
      reception: additionalDataAny.reception || "RECEPÇÃO CENTRAL",
      appointmentTime: appointmentData?.time || null,
      date: appointmentData?.date || null
    };
    
    return fullPatientData;
  } catch (error) {
    console.error("Error in getPatientById:", error);
    return null;
  }
};

export const getAllPatients = async (): Promise<Patient[]> => {
  try {
    console.log("Iniciando getAllPatients");
    // First get all patients
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching patients:", error);
      return [];
    }

    if (!patients || patients.length === 0) {
      return [];
    }

    console.log(`Encontrados ${patients.length} pacientes`);

    // Get all patient IDs to use in our queries
    const patientIds = patients.map(p => p.id);
    
    // Get all additional data for patients in one query
    const { data: additionalDataArray } = await supabase
      .from('patient_additional_data')
      .select('*')
      .in('id', patientIds);
    
    console.log(`Dados adicionais encontrados para ${additionalDataArray?.length || 0} pacientes`);

    // Get all appointments for these patients, most recent first
    const { data: appointmentsArray } = await supabase
      .from('appointments')
      .select('*')
      .in('patient_id', patientIds)
      .order('date', { ascending: false })
      .order('time', { ascending: false });
    
    console.log(`Agendamentos encontrados: ${appointmentsArray?.length || 0}`);

    // Create maps for quick lookup
    const additionalDataMap = (additionalDataArray || []).reduce((acc, data) => {
      acc[data.id] = data;
      return acc;
    }, {} as Record<string, any>);
    
    // Group appointments by patient_id, keeping only the most recent one
    const appointmentMap: Record<string, any> = {};
    (appointmentsArray || []).forEach(appointment => {
      if (!appointmentMap[appointment.patient_id]) {
        appointmentMap[appointment.patient_id] = appointment;
      }
    });
    
    console.log("appointmentMap:", appointmentMap);
    console.log("additionalDataMap:", additionalDataMap);

    // Transform data to include additional fields
    const transformedData = patients.map(patient => {
      const patientAny = patient as any;
      const additionalData = additionalDataMap[patient.id] || {};
      const appointment = appointmentMap[patient.id] || {};
      
      const transformedPatient = {
        ...patient,
        // Priorizar dados do appointment, depois do additionalData, depois fallbacks
        specialty: additionalData.specialty || patient.attendance_type || "Não definida",
        professional: additionalData.professional || patient.father_name || "Não definido", 
        health_plan: additionalData.health_plan || "Não informado",
        reception: additionalData.reception || "RECEPÇÃO CENTRAL",
        // Usar appointment time e date se existirem
        appointmentTime: appointment.time || additionalData.appointmentTime || null,
        date: appointment.date || 
              patientAny.date || 
              (patient.created_at ? ensureProperDateFormat(patient.created_at.split('T')[0]) : "Não agendado"),
        // Incluir o status do appointment se existir
        appointmentStatus: appointment.status || "pending"
      };
      
      return transformedPatient;
    });

    console.log("Dados transformados de pacientes:", transformedData);
    return transformedData;
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

export const getHospitalizedPatients = async (): Promise<HospitalizedPatient[]> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('status', 'Internado');
      
    if (error) {
      console.error("Error fetching hospitalized patients:", error);
      return [];
    }
    
    // Transform Patient data to match HospitalizedPatient type
    const hospitalizedPatients: HospitalizedPatient[] = (data || []).map(patient => ({
      id: patient.id,
      name: patient.name,
      birth_date: patient.birth_date || "",
      unit: patient.mother_name || "Unidade Geral", // Using mother_name field as placeholder for unit
      bed: `${Math.floor(Math.random() * 100) + 1}`, // Generating random bed number for demo
      doctor: patient.father_name || "Dr. Silva", // Using father_name field as placeholder for doctor
      diagnosis: patient.person_type || "Em observação", // Using person_type as placeholder for diagnosis
      phone: patient.phone,
      email: patient.email,
      allergies: [], // Empty array as default
      admissionDate: ensureProperDateFormat(patient.created_at?.split('T')[0]) || "01/01/2023"
    }));
    
    return hospitalizedPatients;
  } catch (error) {
    console.error("Error in getHospitalizedPatients:", error);
    return [];
  }
};
