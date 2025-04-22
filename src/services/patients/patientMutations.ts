
import { supabase } from "@/integrations/supabase/client";
import { Patient, PatientDraft } from "./types";
import { 
  savePatientAdditionalData, 
  savePatientDocument, 
  savePatientAllergy, 
  savePatientNote,
  addPatientLog
} from "./patientAdditionalDataService";

export const savePatient = async (patient: Patient): Promise<Patient | null> => {
  try {
    // Prepare patient data for saving
    const patientData = {
      id: patient.id || undefined, // Let Supabase generate UUID if not provided
      name: patient.name,
      cpf: patient.cpf || null,
      phone: patient.phone || null,
      email: patient.email || null,
      address: typeof patient.address === 'object' ? JSON.stringify(patient.address) : patient.address,
      birth_date: patient.birth_date || null,
      status: patient.status || 'Agendado',
      person_type: patient.person_type || null,
      gender: patient.gender || null
    };

    console.log("Saving patient data:", patientData);

    // Attempt to insert the patient data
    const { data, error } = await supabase
      .from('patients')
      .upsert(patientData)
      .select();
      
    if (error) {
      console.error("Erro ao salvar paciente:", error);
      return null;
    }
    
    const savedPatient = data[0] as Patient;
    console.log("Patient saved successfully:", savedPatient);
    
    // Log the action
    try {
      await addPatientLog({
        patient_id: savedPatient.id,
        action: "Cadastro/Atualização",
        description: "Dados do paciente atualizados",
        performed_by: "Sistema"
      });
    } catch (logError) {
      console.error("Erro ao registrar log:", logError);
      // Continue even if logging fails
    }
    
    return savedPatient;
  } catch (error) {
    console.error("Erro em savePatient:", error);
    return null;
  }
};

export const saveCompletePatient = async (
  patient: Patient, 
  additionalData?: any, 
  documents?: any[], 
  allergies?: any[], 
  notes?: string
): Promise<boolean> => {
  try {
    // 1. Salvar dados básicos do paciente
    const savedPatient = await savePatient(patient);
    
    if (!savedPatient) {
      return false;
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
      for (const doc of documents) {
        await savePatientDocument({
          ...doc,
          patient_id: savedPatient.id
        });
      }
    }
    
    // 4. Salvar alergias se fornecidas
    if (allergies && allergies.length > 0) {
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
    
    return true;
  } catch (error) {
    console.error("Erro em saveCompletePatient:", error);
    return false;
  }
};

export const saveDraftPatient = (patientDraft: PatientDraft): void => {
  try {
    localStorage.setItem('patientDraft', JSON.stringify(patientDraft));
  } catch (error) {
    console.error("Erro ao salvar rascunho do paciente:", error);
  }
};

export const loadDraftPatient = (): PatientDraft | null => {
  try {
    const draft = localStorage.getItem('patientDraft');
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error("Erro ao carregar rascunho do paciente:", error);
    return null;
  }
};

export const clearDraftPatient = (): void => {
  try {
    localStorage.removeItem('patientDraft');
  } catch (error) {
    console.error("Erro ao limpar rascunho do paciente:", error);
  }
};

export const confirmPatientAppointment = async (patientId: string, appointmentData?: any): Promise<Patient | null> => {
  try {
    // Atualizar status do paciente para confirmado
    const { data, error } = await supabase
      .from('patients')
      .update({ status: 'Confirmado' })
      .eq('id', patientId)
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao confirmar agendamento do paciente:", error);
      return null;
    }
    
    // Se dados de agendamento forem fornecidos, salve-os na tabela de agendamentos
    if (appointmentData) {
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          patient_id: patientId,
          ...appointmentData
        });
        
      if (appointmentError) {
        console.error("Erro ao salvar dados do agendamento:", appointmentError);
      }
    }
    
    // Registrar no log
    await addPatientLog({
      patient_id: patientId,
      action: "Confirmação",
      description: "Agendamento confirmado",
      performed_by: "Sistema"
    });
    
    return data;
  } catch (error) {
    console.error("Erro em confirmPatientAppointment:", error);
    return null;
  }
};
