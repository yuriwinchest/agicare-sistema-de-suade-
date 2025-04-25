
import { supabase } from "@/integrations/supabase/client";
import { savePatient } from "../../patientMutations";
import { 
  savePatientAdditionalData, 
  savePatientDocument, 
  savePatientAllergy, 
  savePatientNote,
  addPatientLog
} from "../patientAdditionalDataService";

export const saveCompletePatient = async (
  patient: any, 
  additionalData?: any, 
  documents?: any[], 
  allergies?: any[], 
  notes?: string
): Promise<boolean> => {
  try {
    console.log("Starting saveCompletePatient with data:", { patient, additionalData, documents, allergies, notes });
    
    // 1. Salvar dados básicos do paciente
    const savedPatient = await savePatient(patient);
    
    if (!savedPatient) {
      console.error("Failed to save basic patient data");
      return false;
    }
    
    console.log("Successfully saved basic patient data:", savedPatient);
    
    // Check if in demo mode and handle accordingly
    const { data: session } = await supabase.auth.getSession();
    const isAuthenticated = !!session?.session;
    
    if (!isAuthenticated) {
      console.log("Demo mode detected - handling additional data in demo mode");
      return true; // In demo mode, just return success
    }
    
    // 2. Salvar dados complementares se fornecidos
    if (additionalData) {
      const patientAdditionalData = {
        id: savedPatient.id,
        ...additionalData
      };
      await savePatientAdditionalData(patientAdditionalData);
    }
    
    // 3. Salvar documentos se fornecidos
    if (documents && documents.length > 0) {
      for (const doc of documents) {
        await savePatientDocument({
          ...doc,
          patient_id: savedPatient.id
        });
      }
    }
    
    // 4. Salvar alergias se fornecidas
    if (allergies && allergies.length > 0) {
      for (const allergy of allergies) {
        await savePatientAllergy({
          ...allergy,
          patient_id: savedPatient.id
        });
      }
    }
    
    // 5. Salvar notas se fornecidas
    if (notes) {
      await savePatientNote({
        patient_id: savedPatient.id,
        notes: notes,
        created_by: "Sistema"
      });
    }
    
    console.log("Successfully saved complete patient data");
    return true;
  } catch (error) {
    console.error("Erro em saveCompletePatient:", error);
    return false;
  }
};
