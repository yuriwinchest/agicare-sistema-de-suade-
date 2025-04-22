
import { supabase } from "@/services/supabaseClient";
import { 
  PatientAdditionalData, 
  PatientDocument, 
  PatientAllergy, 
  PatientNote, 
  PatientLog 
} from "./types";

// Serviço para dados complementares
export const savePatientAdditionalData = async (data: PatientAdditionalData): Promise<PatientAdditionalData | null> => {
  try {
    const { data: savedData, error } = await supabase
      .from('patient_additional_data')
      .upsert(data)
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao salvar dados complementares:", error);
      return null;
    }
    
    return savedData;
  } catch (error) {
    console.error("Erro em savePatientAdditionalData:", error);
    return null;
  }
};

export const getPatientAdditionalData = async (patientId: string): Promise<PatientAdditionalData | null> => {
  try {
    const { data, error } = await supabase
      .from('patient_additional_data')
      .select('*')
      .eq('id', patientId)
      .maybeSingle();
      
    if (error) {
      console.error("Erro ao buscar dados complementares:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro em getPatientAdditionalData:", error);
    return null;
  }
};

// Serviço para documentos
export const savePatientDocument = async (document: PatientDocument): Promise<PatientDocument | null> => {
  try {
    const { data, error } = await supabase
      .from('patient_documents')
      .upsert(document)
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao salvar documento:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro em savePatientDocument:", error);
    return null;
  }
};

export const getPatientDocuments = async (patientId: string): Promise<PatientDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('patient_documents')
      .select('*')
      .eq('patient_id', patientId);
      
    if (error) {
      console.error("Erro ao buscar documentos:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro em getPatientDocuments:", error);
    return [];
  }
};

// Serviço para alergias
export const savePatientAllergy = async (allergy: PatientAllergy): Promise<PatientAllergy | null> => {
  try {
    const { data, error } = await supabase
      .from('patient_allergies')
      .upsert(allergy)
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao salvar alergia:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro em savePatientAllergy:", error);
    return null;
  }
};

export const getPatientAllergies = async (patientId: string): Promise<PatientAllergy[]> => {
  try {
    const { data, error } = await supabase
      .from('patient_allergies')
      .select('*')
      .eq('patient_id', patientId);
      
    if (error) {
      console.error("Erro ao buscar alergias:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro em getPatientAllergies:", error);
    return [];
  }
};

// Serviço para notas
export const savePatientNote = async (note: PatientNote): Promise<PatientNote | null> => {
  try {
    const { data, error } = await supabase
      .from('patient_notes')
      .upsert(note)
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao salvar nota:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro em savePatientNote:", error);
    return null;
  }
};

export const getPatientNotes = async (patientId: string): Promise<PatientNote[]> => {
  try {
    const { data, error } = await supabase
      .from('patient_notes')
      .select('*')
      .eq('patient_id', patientId);
      
    if (error) {
      console.error("Erro ao buscar notas:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro em getPatientNotes:", error);
    return [];
  }
};

// Serviço para logs
export const addPatientLog = async (log: PatientLog): Promise<PatientLog | null> => {
  try {
    const { data, error } = await supabase
      .from('patient_logs')
      .insert(log)
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao adicionar log:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro em addPatientLog:", error);
    return null;
  }
};

export const getPatientLogs = async (patientId: string): Promise<PatientLog[]> => {
  try {
    const { data, error } = await supabase
      .from('patient_logs')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Erro ao buscar logs:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro em getPatientLogs:", error);
    return [];
  }
};
