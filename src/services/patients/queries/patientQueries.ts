
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
    
    // Combine the data with safe access to properties
    const additionalDataAny = additionalData as any || {};
    
    const fullPatientData: Patient = {
      ...patientData,
      // Use safe optional chaining and fallbacks
      specialty: additionalDataAny.specialty || patientData.attendance_type || "Não definida",
      professional: additionalDataAny.professional || patientData.father_name || "Não definido",
      health_plan: additionalDataAny.health_plan || "Não informado",
      reception: additionalDataAny.reception || "RECEPÇÃO CENTRAL",
      appointmentTime: additionalDataAny.appointmentTime || null
    };
    
    return fullPatientData;
  } catch (error) {
    console.error("Error in getPatientById:", error);
    return null;
  }
};

export const getAllPatients = async (): Promise<Patient[]> => {
  try {
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

    // Get all additional data for patients in one query
    const patientIds = patients.map(p => p.id);
    const { data: additionalDataArray } = await supabase
      .from('patient_additional_data')
      .select('*')
      .in('id', patientIds);

    // Create a map for quick lookup
    const additionalDataMap = (additionalDataArray || []).reduce((acc, data) => {
      acc[data.id] = data;
      return acc;
    }, {} as Record<string, any>);

    // Transform data to include additional fields
    const transformedData = patients.map(patient => {
      const patientAny = patient as any;
      const additionalData = additionalDataMap[patient.id] || {};
      
      return {
        ...patient,
        specialty: additionalData.specialty || patient.attendance_type || "Não definida",
        professional: additionalData.professional || patient.father_name || "Não definido", 
        health_plan: additionalData.health_plan || "Não informado",
        reception: additionalData.reception || "RECEPÇÃO CENTRAL",
        appointmentTime: additionalData.appointmentTime || null,
        // Ensure date is properly formatted for display
        date: patientAny.date || (patient.created_at ? ensureProperDateFormat(patient.created_at.split('T')[0]) : "Não agendado")
      };
    });

    console.log("Transformed patient data:", transformedData);
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
