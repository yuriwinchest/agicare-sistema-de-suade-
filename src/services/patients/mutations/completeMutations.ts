
import { supabase } from "@/integrations/supabase/client";
import { savePatient } from "./basicMutations";
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
    
    // Ensure reception field is set, if not provided, set a default value
    if (!patient.reception) {
      patient.reception = "RECEPÇÃO CENTRAL";
    }
    
    // 1. Salvar dados básicos do paciente - Certifica que os dados são formatados corretamente
    const patientData = {
      ...patient,
      // Propriedades importantes
      name: patient.name,
      cpf: patient.cpf || null,
      phone: patient.phone || null,
      email: patient.email || null,
      address: typeof patient.address === 'object' 
        ? JSON.stringify(patient.address) 
        : patient.address,
      birth_date: patient.birth_date || null,
      status: patient.status || 'Agendado',
      person_type: patient.person_type || null,
      gender: patient.gender || null,
      father_name: patient.father_name || null,
      mother_name: patient.mother_name || null,
      specialty: patient.specialty || null,
      professional: patient.professional || null,
      health_plan: patient.health_plan || patient.healthPlan || null,
      date: patient.date || null,
      appointmentTime: patient.appointmentTime || null
    };
    
    const savedPatient = await savePatient(patientData);
    
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
      console.log("Saving documents:", documents);
      for (const doc of documents) {
        await savePatientDocument({
          ...doc,
          patient_id: savedPatient.id
        });
      }
    }
    
    // 4. Salvar alergias se fornecidas
    if (allergies && allergies.length > 0) {
      console.log("Saving allergies:", allergies);
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
    
    // 6. Log the successful registration
    await addPatientLog({
      patient_id: savedPatient.id,
      action: "Cadastro",
      description: `Paciente cadastrado na ${patient.reception || 'recepção'}.`,
      performed_by: "Sistema"
    });
    
    console.log("Successfully saved complete patient data");
    return true;
  } catch (error) {
    console.error("Erro em saveCompletePatient:", error);
    return false;
  }
};
