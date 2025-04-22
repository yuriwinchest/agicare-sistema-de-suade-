
import { supabase } from "@/services/supabaseClient";
import { NursingAssessment, VitalSigns } from "./types";

export const saveNursingAssessment = async (assessment: NursingAssessment): Promise<NursingAssessment | null> => {
  try {
    const { data, error } = await supabase
      .from('nursing_records')
      .upsert({
        id: assessment.id,
        patient_id: assessment.patient_id,
        nurse_id: assessment.nurse_id,
        procedures: assessment.procedures,
        observations: assessment.observations,
        vital_signs: assessment.vital_signs as any, // Type assertion to accommodate JSON
        created_at: assessment.created_at,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving nursing assessment:", error);
      return null;
    }

    return data as NursingAssessment;
  } catch (error) {
    console.error("Error in saveNursingAssessment:", error);
    return null;
  }
};

export const updateVitalSigns = async (patientId: string, vitalSigns: VitalSigns): Promise<boolean> => {
  try {
    // First check if a nursing record exists for this patient
    const { data: existingRecord } = await supabase
      .from('nursing_records')
      .select('id')
      .eq('patient_id', patientId)
      .single();
      
    if (existingRecord) {
      // Update existing record
      const { error } = await supabase
        .from('nursing_records')
        .update({
          vital_signs: vitalSigns as any, // Type assertion to accommodate JSON
          updated_at: new Date().toISOString()
        })
        .eq('id', existingRecord.id);
        
      return !error;
    } else {
      // Create new record
      const { error } = await supabase
        .from('nursing_records')
        .insert({
          patient_id: patientId,
          vital_signs: vitalSigns as any, // Type assertion to accommodate JSON
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      return !error;
    }
  } catch (error) {
    console.error("Error updating vital signs:", error);
    return false;
  }
};
