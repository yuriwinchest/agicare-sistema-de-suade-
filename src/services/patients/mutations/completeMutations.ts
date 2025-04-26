
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
    
    // Ensure reception field is defined
    if (!patient.reception) {
      patient.reception = "RECEPÇÃO CENTRAL";
    }
    
    // 1. Save patient basic data - Ensure data is properly formatted
    const patientData = {
      ...patient,
      // Important properties
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
      attendance_type: patient.specialty || null,
    };
    
    console.log("Formatted data for saving:", patientData);
    
    let { data: savedPatient, error } = await supabase
      .from('patients')
      .insert(patientData)
      .select()
      .single();
    
    if (error) {
      console.error("Error saving patient:", error);
      return false;
    }
    
    if (!savedPatient) {
      console.error("Failed to save patient basic data");
      return false;
    }
    
    console.log("Patient basic data saved successfully:", savedPatient);
    
    // Check if in demo mode and handle accordingly
    const { data: session } = await supabase.auth.getSession();
    const isAuthenticated = !!session?.session;
    
    if (!isAuthenticated) {
      console.log("Demo mode detected - processing additional data in demo mode");
      return true; // In demo mode, just return success
    }
    
    // 2. Save complementary data if provided
    if (additionalData) {
      const patientAdditionalData = {
        id: savedPatient.id,
        ...additionalData
      };
      await savePatientAdditionalData(patientAdditionalData);
    }
    
    // 3. Save documents if provided
    if (documents && documents.length > 0) {
      console.log("Saving documents:", documents);
      for (const doc of documents) {
        if (doc && doc.documentType && doc.documentNumber) {
          await savePatientDocument({
            patient_id: savedPatient.id,
            document_type: typeof doc.documentType === 'object' ? doc.documentType.value : doc.documentType,
            document_number: typeof doc.documentNumber === 'object' ? doc.documentNumber.value : doc.documentNumber,
            issuing_body: doc.issuingBody || "",
            issue_date: doc.issueDate || null
          });
        }
      }
    }
    
    // 4. Save allergies if provided
    if (allergies && allergies.length > 0) {
      console.log("Saving allergies:", allergies);
      for (const allergy of allergies) {
        if (allergy && allergy.allergyType && allergy.description) {
          await savePatientAllergy({
            patient_id: savedPatient.id,
            allergy_type: typeof allergy.allergyType === 'object' ? allergy.allergyType.value : allergy.allergyType,
            description: allergy.description,
            severity: allergy.severity || "Média"
          });
        }
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
    
    // 6. Register log for successful registration
    await addPatientLog({
      patient_id: savedPatient.id,
      action: "Cadastro",
      description: `Paciente cadastrado na ${patient.reception || 'recepção'}.`,
      performed_by: "Sistema"
    });
    
    console.log("Complete patient data saved successfully");
    return true;
  } catch (error) {
    console.error("Error in saveCompletePatient:", error);
    return false;
  }
};
