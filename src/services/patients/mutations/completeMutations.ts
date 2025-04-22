
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
    // 1. Salvar dados básicos do paciente primeiro e garantir que tenha sido salvo
    const savedPatient = await savePatient(patient);
    
    if (!savedPatient) {
      console.error("Falha ao salvar os dados básicos do paciente");
      return false;
    }
    
    console.log("Paciente salvo com sucesso:", savedPatient);
    
    // Garantir que temos um ID válido
    const patientId = savedPatient.id;
    if (!patientId) {
      console.error("ID do paciente inexistente após salvamento");
      return false;
    }
    
    // Array de promessas para processar em sequência
    const operations = [];
    
    // 2. Salvar dados complementares se fornecidos
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
    
    // 3. Salvar documentos se fornecidos
    if (documents && documents.length > 0) {
      operations.push(async () => {
        try {
          for (const doc of documents) {
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
    
    // 4. Salvar alergias se fornecidas
    if (allergies && allergies.length > 0) {
      operations.push(async () => {
        try {
          for (const allergy of allergies) {
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
    
    // 5. Salvar notas se fornecidas
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
    
    // Executar operações em sequência
    for (const operation of operations) {
      await operation();
    }
    
    return true;
  } catch (error) {
    console.error("Erro em saveCompletePatient:", error);
    return false;
  }
};
