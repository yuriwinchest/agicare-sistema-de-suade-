
import { supabase } from "@/services/supabaseClient";
import { Patient, PatientDraft } from "./types";

/**
 * Save a patient to the database
 */
export const savePatient = async (patient: Patient): Promise<Patient | null> => {
  try {
    // Map client-side data structure to match database schema
    const patientData = {
      id: patient.id,
      name: patient.name,
      cpf: patient.cpf || null,
      phone: patient.phone || null,
      email: patient.email || null,
      address: patient.address || null,
      birth_date: patient.birth_date || null,
      status: patient.status || 'active'
    };

    const { data, error } = await supabase
      .from('patients')
      .upsert(patientData)
      .select()
      .single();

    if (error) {
      console.error("Error saving patient:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in savePatient:", error);
    return null;
  }
};

// Draft patient functions using localStorage
export const saveDraftPatient = (patient: PatientDraft): void => {
  try {
    localStorage.setItem('patientDraft', JSON.stringify(patient));
  } catch (error) {
    console.error("Error saving draft patient:", error);
  }
};

export const loadDraftPatient = (): PatientDraft | null => {
  try {
    const draft = localStorage.getItem('patientDraft');
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error("Error loading draft patient:", error);
    return null;
  }
};

export const clearDraftPatient = (): void => {
  try {
    localStorage.removeItem('patientDraft');
  } catch (error) {
    console.error("Error clearing draft patient:", error);
  }
};

/**
 * Update a patient redirection
 */
export const updatePatientRedirection = async (patientId: string, destination: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('patients')
      .update({ destination })
      .eq('id', patientId);
      
    return !error;
  } catch (error) {
    console.error("Error updating patient redirection:", error);
    return false;
  }
};

/**
 * Confirm a patient appointment
 */
export const confirmPatientAppointment = async (appointmentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'confirmed' })
      .eq('id', appointmentId);
      
    return !error;
  } catch (error) {
    console.error("Error confirming appointment:", error);
    return false;
  }
};
