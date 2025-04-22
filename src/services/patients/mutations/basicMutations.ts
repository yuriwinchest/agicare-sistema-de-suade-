
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "../types";
import { addPatientLog } from "@/services/patients/patientAdditionalDataService";
import { ensureUUID } from "../utils/uuidUtils";

export const savePatient = async (patient: Patient): Promise<Patient | null> => {
  try {
    // Ensure we have a session before proceeding
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("No authenticated session");
    }

    // Format birth date properly if needed
    const patientData = {
      name: patient.name,
      birth_date: patient.birth_date || null,
      address: typeof patient.address === 'object' 
        ? JSON.stringify(patient.address) 
        : patient.address,
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
