
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "./types";
import { formatDateForDatabase } from "@/services/patientService";
import { 
  savePatientAdditionalData, 
  savePatientDocument, 
  savePatientAllergy, 
  savePatientNote,
  addPatientLog
} from "./patientAdditionalDataService";

export const savePatient = async (patient: Patient): Promise<Patient | null> => {
  try {
    // Enhanced date formatting with robust error handling
    const formattedBirthDate = formatDateForDatabase(patient.birth_date);
    
    console.log("Original birth_date:", patient.birth_date);
    console.log("Formatted birth_date:", formattedBirthDate);

    const patientData = {
      ...patient,
      birth_date: formattedBirthDate || null,
      id: patient.id || undefined,
      status: patient.status || 'Agendado'
    };

    console.log("Preparing patient data for Supabase:", patientData);

    const { data, error } = await supabase
      .from('patients')
      .upsert(patientData)
      .select()
      .single();
      
    if (error) {
      console.error("Supabase save error:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in savePatient:", error);
    return null;
  }
};
