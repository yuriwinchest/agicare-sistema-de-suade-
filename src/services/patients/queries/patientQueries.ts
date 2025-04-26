
import { Patient, HospitalizedPatient } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { formatDateForDatabase, ensureProperDateFormat } from "../utils/dateUtils";

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
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching patients:", error);
      return [];
    }

    // Transform data to include additional fields
    const transformedData = patients?.map(patient => ({
      ...patient,
      specialty: patient.attendance_type || "Não definida",
      professional: patient.father_name || "Não definido", 
      health_plan: "Não informado"
    })) || [];

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
