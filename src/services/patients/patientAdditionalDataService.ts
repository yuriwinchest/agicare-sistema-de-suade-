
import { supabase } from "@/integrations/supabase/client";
import { 
  PatientAdditionalData, 
  PatientDocument, 
  PatientAllergy, 
  PatientNote, 
  PatientLog 
} from "./types";
import { v4 as uuidv4 } from 'uuid';

// Helper to ensure UUID format
const ensureUUID = (id: string | undefined): string => {
  if (!id) return uuidv4();
  
  // Check if ID is already a valid UUID
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(id)) {
    return id;
  }
  
  return uuidv4();
};

// Verificar se o paciente existe antes de tentar salvar dados relacionados
const verifyPatientExists = async (patientId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('id')
      .eq('id', patientId)
      .maybeSingle();
      
    if (error) {
      console.error("Erro ao verificar existência do paciente:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Erro ao verificar existência do paciente:", error);
    return false;
  }
};

// Serviço para dados complementares
export const savePatientAdditionalData = async (data: PatientAdditionalData): Promise<PatientAdditionalData | null> => {
  try {
    // Ensure valid UUID
    const validId = ensureUUID(data.id);
    
    // Verificar se o paciente existe
    const patientExists = await verifyPatientExists(validId);
    if (!patientExists) {
      console.error("Erro: Tentativa de salvar dados complementares para paciente inexistente:", validId);
      return null;
    }
    
    const validData = {
      ...data,
      id: validId
    };
    
    const { data: savedData, error } = await supabase
      .from('patient_additional_data')
      .upsert(validData)
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
    // Ensure valid UUID for query
    const validId = ensureUUID(patientId);
    
    const { data, error } = await supabase
      .from('patient_additional_data')
      .select('*')
      .eq('id', validId)
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
    // Ensure valid UUID
    const validDoc = {
      ...document,
      patient_id: ensureUUID(document.patient_id)
    };
    
    const { data, error } = await supabase
      .from('patient_documents')
      .upsert(validDoc)
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
    // Ensure valid UUID
    const validAllergy = {
      ...allergy,
      patient_id: ensureUUID(allergy.patient_id)
    };
    
    const { data, error } = await supabase
      .from('patient_allergies')
      .upsert(validAllergy)
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
    // Ensure valid UUID
    const validNote = {
      ...note,
      patient_id: ensureUUID(note.patient_id)
    };
    
    const { data, error } = await supabase
      .from('patient_notes')
      .upsert(validNote)
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
    // Ensure valid UUID
    const validPatientId = ensureUUID(log.patient_id);
    
    // Verificar se o paciente existe
    const patientExists = await verifyPatientExists(validPatientId);
    if (!patientExists) {
      console.error("Erro: Tentativa de adicionar log para paciente inexistente:", validPatientId);
      return null;
    }
    
    const validLog = {
      ...log,
      patient_id: validPatientId
    };
    
    const { data, error } = await supabase
      .from('patient_logs')
      .insert(validLog)
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
