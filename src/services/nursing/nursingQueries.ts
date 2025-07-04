
import { supabase } from "@/integrations/supabase/client";
import { getPatientById } from "../patients/patientQueries";
import { NursingAssessment, VitalSigns, Json } from "./types";

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
    
    // Cast vital_signs to VitalSigns type
    const vitalSigns = data.vital_signs as unknown as VitalSigns;
    
    return {
      id: data.id,
      patient_id: data.patient_id,
      nurse_id: data.nurse_id,
      procedures: data.procedures,
      observations: data.observations,
      vital_signs: vitalSigns,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Erro ao obter dados de enfermagem:", error);
    return null;
  }
};
