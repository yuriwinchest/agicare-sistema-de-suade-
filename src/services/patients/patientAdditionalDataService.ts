
import { supabase } from "@/integrations/supabase/client";
import { PatientAdditionalData, PatientDocument, PatientAllergy, PatientNote, PatientLog } from "./types";

export const savePatientAdditionalData = async (data: PatientAdditionalData) => {
  try {
    // Check if a record already exists for this patient
    const { data: existingData, error: checkError } = await supabase
      .from('patient_additional_data')
      .select('id')
      .eq('id', data.id)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking for existing patient data:", checkError);
    }
    
    if (existingData) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('patient_additional_data')
        .update(data)
        .eq('id', data.id);
        
      if (updateError) {
        console.error("Error updating patient additional data:", updateError);
        return null;
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('patient_additional_data')
        .insert(data);
        
      if (insertError) {
        console.error("Error inserting patient additional data:", insertError);
        return null;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error in savePatientAdditionalData:", error);
    return null;
  }
};

export const savePatientDocument = async (document: PatientDocument) => {
  try {
    const { error } = await supabase
      .from('patient_documents')
      .insert(document);
      
    if (error) {
      console.error("Error saving patient document:", error);
      return null;
    }
    
    return true;
  } catch (error) {
    console.error("Error in savePatientDocument:", error);
    return null;
  }
};

export const savePatientAllergy = async (allergy: PatientAllergy) => {
  try {
    const { error } = await supabase
      .from('patient_allergies')
      .insert(allergy);
      
    if (error) {
      console.error("Error saving patient allergy:", error);
      return null;
    }
    
    return true;
  } catch (error) {
    console.error("Error in savePatientAllergy:", error);
    return null;
  }
};

export const savePatientNote = async (note: PatientNote) => {
  try {
    const { error } = await supabase
      .from('patient_notes')
      .insert(note);
      
    if (error) {
      console.error("Error saving patient note:", error);
      return null;
    }
    
    return true;
  } catch (error) {
    console.error("Error in savePatientNote:", error);
    return null;
  }
};

export const addPatientLog = async (log: PatientLog) => {
  try {
    const { error } = await supabase
      .from('patient_logs')
      .insert(log);
      
    if (error) {
      console.error("Error adding patient log:", error);
      return null;
    }
    
    return true;
  } catch (error) {
    console.error("Error in addPatientLog:", error);
    return null;
  }
};

export const getPatientLogs = async (patientId: string) => {
  try {
    const { data, error } = await supabase
      .from('patient_logs')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching patient logs:", error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error("Error in getPatientLogs:", error);
    return [];
  }
};
