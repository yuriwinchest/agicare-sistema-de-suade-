
import { supabase } from "../supabaseClient";
import { Patient, PatientDraft } from "./types";

// Local storage key for draft patient
const PATIENT_DRAFT_STORAGE_KEY = 'patientDraftData';

export const savePatient = async (patient: Patient): Promise<Patient | null> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .upsert({
        id: patient.id,
        name: patient.name,
        cpf: patient.cpf,
        phone: patient.phone,
        email: patient.email,
        address: typeof patient.address === 'object' ? JSON.stringify(patient.address) : patient.address,
        birth_date: patient.birth_date,
        status: patient.status,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving patient:", error);
      return null;
    }

    return data as Patient;
  } catch (error) {
    console.error("Error in savePatient:", error);
    return null;
  }
};

export const saveDraftPatient = (patientData: PatientDraft): void => {
  try {
    localStorage.setItem(PATIENT_DRAFT_STORAGE_KEY, JSON.stringify(patientData));
  } catch (error) {
    console.error("Error saving draft patient:", error);
  }
};

export const loadDraftPatient = (): PatientDraft | null => {
  try {
    const draftData = localStorage.getItem(PATIENT_DRAFT_STORAGE_KEY);
    return draftData ? JSON.parse(draftData) : null;
  } catch (error) {
    console.error("Error loading draft patient:", error);
    return null;
  }
};

export const clearDraftPatient = (): void => {
  try {
    localStorage.removeItem(PATIENT_DRAFT_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing draft patient:", error);
  }
};

export const confirmPatientAppointment = (patientId: string, appointmentData: any): Patient | null => {
  try {
    // In a real implementation, this would update the patient's status in the database
    console.log(`Confirmed appointment for patient ${patientId} with data:`, appointmentData);
    
    // For now, we'll just return a mock updated patient
    return {
      id: patientId,
      name: "Patient Name",
      cpf: "",
      phone: "",
      email: "",
      address: "",
      birth_date: "",
      status: appointmentData.status || "Confirmed"
    };
  } catch (error) {
    console.error("Error confirming patient appointment:", error);
    return null;
  }
};
