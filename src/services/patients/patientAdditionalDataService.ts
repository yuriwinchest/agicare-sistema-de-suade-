
import { supabase } from "@/integrations/supabase/client";
import { PatientAdditionalData, PatientDocument, PatientAllergy, PatientNote, PatientLog } from "./types";

// Este arquivo está sendo mantido para compatibilidade com o código existente
// mas suas funcionalidades foram movidas para a tabela patients

export const savePatientAdditionalData = async (data: PatientAdditionalData) => {
  try {
    const { error } = await supabase
      .from('patients')
      .update({
        health_plan: data.health_plan,
        specialty: data.specialty,
        reception: data.reception,
        professional: data.professional,
        appointment_time: data.appointmentTime,
        place_of_birth: data.place_of_birth,
        place_of_birth_state: data.place_of_birth_state,
        education_level: data.education_level,
        occupation: data.occupation,
        health_card_number: data.health_card_number
      })
      .eq('id', data.id);
        
    if (error) {
      console.error("Erro atualizando dados adicionais do paciente:", error);
      return null;
    }
    
    return true;
  } catch (error) {
    console.error("Erro em savePatientAdditionalData:", error);
    return null;
  }
};

export const savePatientDocument = async (document: PatientDocument) => {
  try {
    // Primeiro obtém os documentos existentes
    const { data: patientData, error: fetchError } = await supabase
      .from('patients')
      .select('documents')
      .eq('id', document.patient_id)
      .single();
      
    if (fetchError) {
      console.error("Erro ao buscar documentos do paciente:", fetchError);
      return null;
    }
    
    // Adiciona o novo documento à lista
    const documents = patientData.documents || [];
    documents.push({
      document_type: document.document_type,
      document_number: document.document_number,
      issuing_body: document.issuing_body,
      issue_date: document.issue_date
    });
    
    // Atualiza o registro do paciente com a nova lista de documentos
    const { error: updateError } = await supabase
      .from('patients')
      .update({ documents })
      .eq('id', document.patient_id);
      
    if (updateError) {
      console.error("Erro salvando documento do paciente:", updateError);
      return null;
    }
    
    return true;
  } catch (error) {
    console.error("Erro em savePatientDocument:", error);
    return null;
  }
};

export const savePatientAllergy = async (allergy: PatientAllergy) => {
  try {
    // Primeiro obtém as alergias existentes
    const { data: patientData, error: fetchError } = await supabase
      .from('patients')
      .select('allergies')
      .eq('id', allergy.patient_id)
      .single();
      
    if (fetchError) {
      console.error("Erro ao buscar alergias do paciente:", fetchError);
      return null;
    }
    
    // Adiciona a nova alergia à lista
    const allergies = patientData.allergies || [];
    allergies.push({
      allergy_type: allergy.allergy_type,
      description: allergy.description,
      severity: allergy.severity
    });
    
    // Atualiza o registro do paciente com a nova lista de alergias
    const { error: updateError } = await supabase
      .from('patients')
      .update({ allergies })
      .eq('id', allergy.patient_id);
      
    if (updateError) {
      console.error("Erro salvando alergia do paciente:", updateError);
      return null;
    }
    
    return true;
  } catch (error) {
    console.error("Erro em savePatientAllergy:", error);
    return null;
  }
};

export const savePatientNote = async (note: PatientNote) => {
  try {
    const { error } = await supabase
      .from('patient_notes')
      .insert(note);
      
    if (error) {
      console.error("Erro salvando nota do paciente:", error);
      return null;
    }
    
    return true;
  } catch (error) {
    console.error("Erro em savePatientNote:", error);
    return null;
  }
};

export const addPatientLog = async (log: PatientLog) => {
  try {
    const { error } = await supabase
      .from('patient_logs')
      .insert(log);
      
    if (error) {
      console.error("Erro adicionando log do paciente:", error);
      return null;
    }
    
    return true;
  } catch (error) {
    console.error("Erro em addPatientLog:", error);
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
      console.error("Erro ao buscar logs do paciente:", error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error("Erro em getPatientLogs:", error);
    return [];
  }
};
