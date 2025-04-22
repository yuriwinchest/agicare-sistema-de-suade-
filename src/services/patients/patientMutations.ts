import { supabase } from "@/integrations/supabase/client";
import { Patient, PatientDraft } from "@/services/patients/types";
import { 
  savePatientAdditionalData, 
  savePatientDocument, 
  savePatientAllergy, 
  savePatientNote,
  addPatientLog
} from "@/services/patients/patientAdditionalDataService";
import { formatDateForDatabase } from "@/services/patientService";
import { v4 as uuidv4 } from 'uuid';

// Helper to validate and convert IDs to UUID format
const ensureUUID = (id: string | undefined): string | undefined => {
  if (!id) return undefined;
  
  // Check if ID is already a valid UUID
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(id)) {
    return id;
  }
  
  // If ID is not a valid UUID, generate a new one
  console.log(`Converting non-UUID ID "${id}" to proper UUID format`);
  return uuidv4();
};

export const savePatient = async (patient: Patient): Promise<Patient | null> => {
  try {
    // Ensure we have a session before proceeding
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("No authenticated session");
    }

    // Format birth date properly
    const formattedBirthDate = formatDateForDatabase(patient.birth_date);
    
    // Ensure address is a string (stringify if it's an object)
    const formattedAddress = typeof patient.address === 'object' 
      ? JSON.stringify(patient.address) 
      : patient.address;
    
    // Make sure required fields are not undefined or null
    const patientData = {
      name: patient.name,
      birth_date: formattedBirthDate || null,
      address: formattedAddress,
      id: patient.id,
      status: patient.status || 'Agendado',
      cpf: patient.cpf || null,
      phone: patient.phone || null,
      email: patient.email || null,
      gender: patient.gender || null,
      person_type: patient.person_type || null,
      father_name: patient.father_name || null,
      mother_name: patient.mother_name || null,
      cns: patient.cns || null,
      marital_status: patient.marital_status || null
    };

    // First try to insert the patient
    const { data, error } = await supabase
      .from('patients')
      .upsert(patientData)
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao salvar paciente:", error);
      throw error;
    }
    
    const savedPatient = data as Patient;
    
    // Try to add a log entry
    try {
      await addPatientLog({
        patient_id: savedPatient.id,
        action: "Cadastro/Atualização",
        description: "Dados do paciente atualizados",
        performed_by: session.user.email || "Sistema"
      });
    } catch (logError) {
      console.error("Erro ao registrar log:", logError);
      // Continue even if logging fails
    }
    
    return savedPatient;
  } catch (error) {
    console.error("Erro em savePatient:", error);
    throw error;
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
    // 1. Salvar dados básicos do paciente primeiro e garantir que tenha sido salvo
    const savedPatient = await savePatient(patient);
    
    if (!savedPatient) {
      console.error("Falha ao salvar os dados básicos do paciente");
      return false;
    }
    
    console.log("Paciente salvo com sucesso:", savedPatient);
    
    // Garantir que temos um ID válido
    const patientId = savedPatient.id;
    if (!patientId) {
      console.error("ID do paciente inexistente após salvamento");
      return false;
    }
    
    // Array de promessas para processar em sequência
    const operations = [];
    
    // 2. Salvar dados complementares se fornecidos
    if (additionalData) {
      operations.push(async () => {
        try {
          const patientAdditionalData = {
            id: patientId,
            ...additionalData
          };
          await savePatientAdditionalData(patientAdditionalData);
          console.log("Dados complementares salvos com sucesso");
        } catch (error) {
          console.error("Erro ao salvar dados complementares:", error);
          // Continue com outras operações
        }
      });
    }
    
    // 3. Salvar documentos se fornecidos
    if (documents && documents.length > 0) {
      operations.push(async () => {
        try {
          for (const doc of documents) {
            await savePatientDocument({
              ...doc,
              patient_id: patientId
            });
          }
          console.log("Documentos salvos com sucesso");
        } catch (error) {
          console.error("Erro ao salvar documentos:", error);
          // Continue com outras operações
        }
      });
    }
    
    // 4. Salvar alergias se fornecidas
    if (allergies && allergies.length > 0) {
      operations.push(async () => {
        try {
          for (const allergy of allergies) {
            await savePatientAllergy({
              ...allergy,
              patient_id: patientId
            });
          }
          console.log("Alergias salvas com sucesso");
        } catch (error) {
          console.error("Erro ao salvar alergias:", error);
          // Continue com outras operações
        }
      });
    }
    
    // 5. Salvar notas se fornecidas
    if (notes) {
      operations.push(async () => {
        try {
          await savePatientNote({
            patient_id: patientId,
            notes: notes,
            created_by: "Sistema"
          });
          console.log("Notas salvas com sucesso");
        } catch (error) {
          console.error("Erro ao salvar notas:", error);
          // Continue com outras operações
        }
      });
    }
    
    // Executar operações em sequência
    for (const operation of operations) {
      await operation();
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
