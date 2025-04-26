
import { Patient } from "../types";
import { savePatient } from "./basicMutations";
import { 
  savePatientAdditionalData, 
  savePatientDocument, 
  savePatientAllergy, 
  savePatientNote 
} from "../patientAdditionalDataService";

export const saveCompletePatient = async (
  patient: Patient, 
  additionalData?: any, 
  documents?: any[], 
  allergies?: any[], 
  notes?: string
): Promise<boolean> => {
  try {
    // 1. Save basic patient data
    const savedPatient = await savePatient(patient);
    
    if (!savedPatient) {
      return false;
    }
    
    // 2. Save additional data if provided
    if (additionalData) {
      const patientAdditionalData = {
        id: savedPatient.id,
        ...additionalData
      };
      await savePatientAdditionalData(patientAdditionalData);
    }
    
    // 3. Save documents if provided
    if (documents && documents.length > 0) {
      for (const doc of documents) {
        // Format document data correctly
        const documentData = {
          patient_id: savedPatient.id,
          document_type: doc.document_type || doc.documentType,
          document_number: doc.document_number || doc.documentNumber,
          issuing_body: doc.issuing_body || doc.issuingBody || null,
          issue_date: doc.issue_date || doc.issueDate || null
        };
        
        await savePatientDocument(documentData);
      }
    }
    
    // 4. Save allergies if provided
    if (allergies && allergies.length > 0) {
      for (const allergy of allergies) {
        const allergyData = {
          patient_id: savedPatient.id,
          allergy_type: allergy.allergy_type || allergy.allergyType,
          description: allergy.description,
          severity: allergy.severity || "Média"
        };
        
        await savePatientAllergy(allergyData);
      }
    }
    
    // 5. Save notes if provided
    if (notes) {
      await savePatientNote({
        patient_id: savedPatient.id,
        notes: notes,
        created_by: "Sistema"
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error in saveCompletePatient:", error);
    return false;
  }
};
