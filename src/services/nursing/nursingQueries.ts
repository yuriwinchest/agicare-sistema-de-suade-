
import { supabase } from "@/integrations/supabase/client";
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
    return data;
  } catch (error) {
    console.error("Erro ao obter dados de enfermagem:", error);
    return null;
  }
};
