
import { supabase } from "@/services/supabaseClient";
import { Patient, PatientDraft } from "./types";

export const savePatient = async (patient: Patient): Promise<Patient | null> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .upsert(patient)
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

export const saveDraftPatient = (patientDraft: PatientDraft): void => {
  try {
    localStorage.setItem('patientDraft', JSON.stringify(patientDraft));
  } catch (error) {
    console.error("Error saving patient draft:", error);
  }
};

export const loadDraftPatient = (): PatientDraft | null => {
  try {
    const draft = localStorage.getItem('patientDraft');
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error("Error loading patient draft:", error);
    return null;
  }
};

export const clearDraftPatient = (): void => {
  try {
    localStorage.removeItem('patientDraft');
  } catch (error) {
    console.error("Error clearing patient draft:", error);
  }
};

export const confirmPatientAppointment = async (patientId: string, appointmentData?: any): Promise<Patient | null> => {
  try {
    // Update patient status to confirmed
    const { data, error } = await supabase
      .from('patients')
      .update({ status: 'Confirmado' })
      .eq('id', patientId)
      .select()
      .single();
      
    if (error) {
      console.error("Error confirming patient appointment:", error);
      return null;
    }
    
    // If appointment data is provided, save it to the appointments table
    if (appointmentData) {
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          patient_id: patientId,
          ...appointmentData
        });
        
      if (appointmentError) {
        console.error("Error saving appointment data:", appointmentError);
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error in confirmPatientAppointment:", error);
    return null;
  }
};
