
import { savePatient } from "./basicMutations";
import { Patient } from "../types";
import { 
  savePatientAdditionalData, 
  savePatientDocument, 
  savePatientAllergy, 
  savePatientNote,
  addPatientLog
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
    
    // 2. Save additional data
    const patientAdditionalData = {
      id: savedPatient.id,
      specialty: patient.specialty,
      professional: patient.professional,
      health_plan: patient.health_plan,
      reception: patient.reception || "RECEPÇÃO CENTRAL",
      appointmentTime: patient.appointmentTime || null,
      ...(additionalData || {})
    };
    
    await savePatientAdditionalData(patientAdditionalData);
    
    // 3. Save documents if provided
    if (documents && documents.length > 0) {
      for (const doc of documents) {
        await savePatientDocument({
          ...doc,
          patient_id: savedPatient.id
        });
      }
    }
    
    // 4. Save allergies if provided
    if (allergies && allergies.length > 0) {
      for (const allergy of allergies) {
        await savePatientAllergy({
          ...allergy,
          patient_id: savedPatient.id
        });
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

    // Log the complete patient registration
    await addPatientLog({
      patient_id: savedPatient.id,
      action: "Cadastro Completo",
      description: "Paciente registrado com todos os dados",
      performed_by: "Sistema"
    });
    
    return true;
  } catch (error) {
    console.error("Error in saveCompletePatient:", error);
    return false;
  }
};
