
import { Patient } from "../types";
import { savePatient } from "./basicMutations";
import { 
  savePatientAdditionalData, 
  savePatientDocument, 
  savePatientAllergy, 
  savePatientNote 
} from "@/services/patients/patientAdditionalDataService";

export const saveCompletePatient = async (
  patient: Patient, 
  additionalData?: any, 
  documents?: any[], 
  allergies?: any[], 
  notes?: string
): Promise<boolean> => {
  try {
    // Validate patient data before saving
    if (!patient.name) {
      console.error("Patient name is required");
      return false;
    }
    
    // 1. Save basic patient data first and ensure it has been saved
    const savedPatient = await savePatient(patient);
    
    if (!savedPatient) {
      console.error("Falha ao salvar os dados básicos do paciente");
      return false;
    }
    
    console.log("Paciente salvo com sucesso:", savedPatient);
    
    // Ensure we have a valid ID
    const patientId = savedPatient.id;
    if (!patientId) {
      console.error("ID do paciente inexistente após salvamento");
      return false;
    }
    
    // Use a sequential approach to avoid simultaneous operations
    // Array of promises to process in sequence
    const operations = [];
    
    // 2. Save additional data if provided
    if (additionalData) {
      operations.push(async () => {
        try {
          const patientAdditionalData = {
            id: patientId,
            ...additionalData
          };
          await savePatientAdditionalData(patientAdditionalData);
          console.log("Dados complementares salvos com sucesso");
        } catch (error) {
          console.error("Erro ao salvar dados complementares:", error);
        }
      });
    }
    
    // 3. Save documents if provided
    if (documents && documents.length > 0) {
      operations.push(async () => {
        try {
          for (const doc of documents) {
            if (!doc) continue; // Skip empty documents
            await savePatientDocument({
              ...doc,
              patient_id: patientId
            });
          }
          console.log("Documentos salvos com sucesso");
        } catch (error) {
          console.error("Erro ao salvar documentos:", error);
        }
      });
    }
    
    // 4. Save allergies if provided
    if (allergies && allergies.length > 0) {
      operations.push(async () => {
        try {
          for (const allergy of allergies) {
            if (!allergy) continue; // Skip empty allergies
            await savePatientAllergy({
              ...allergy,
              patient_id: patientId
            });
          }
          console.log("Alergias salvas com sucesso");
        } catch (error) {
          console.error("Erro ao salvar alergias:", error);
        }
      });
    }
    
    // 5. Save notes if provided
    if (notes) {
      operations.push(async () => {
        try {
          await savePatientNote({
            patient_id: patientId,
            notes: notes,
            created_by: "Sistema"
          });
          console.log("Notas salvas com sucesso");
        } catch (error) {
          console.error("Erro ao salvar notas:", error);
        }
      });
    }
    
    // Execute operations in sequence
    for (const operation of operations) {
      await operation();
    }
    
    return true;
  } catch (error) {
    console.error("Erro em saveCompletePatient:", error);
    return false;
  }
};
