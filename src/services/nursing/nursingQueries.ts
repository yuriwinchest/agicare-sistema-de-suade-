
import { supabase } from "@/services/supabaseClient";
import { getPatientById } from "../patients/patientQueries";
import { NursingAssessment } from "./types";

export const getNursingAssessment = async (patientId: string): Promise<NursingAssessment | null> => {
  try {
    const patient = await getPatientById(patientId);
    if (!patient) return null;
    
    const { data, error } = await supabase
      .from('nursing_records')
      .select('*')
      .eq('patient_id', patientId)
      .single();
      
    if (error) return null;
    
    // Map the database result to our NursingAssessment type
    return {
      id: data.id,
      patient_id: data.patient_id,
      nurse_id: data.nurse_id,
      procedures: data.procedures,
      observations: data.observations,
      vital_signs: data.vital_signs,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Erro ao obter dados de enfermagem:", error);
    return null;
  }
};
