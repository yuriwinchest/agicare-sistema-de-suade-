
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

    // Validate required fields
    if (!patient.name) {
      throw new Error("Patient name is required");
    }

    // Ensure ID is in correct UUID format or null to let Supabase generate it
    const patientId = patient.id ? ensureUUID(patient.id) : undefined;
    
    // Format birth date properly if needed
    const patientData = {
      name: patient.name,
      birth_date: patient.birth_date || null,
      address: typeof patient.address === 'object' 
        ? JSON.stringify(patient.address) 
        : patient.address,
      id: patientId,
      status: patient.status || 'Agendado',
      cpf: patient.cpf || null,
      phone: patient.phone || null,
      email: patient.email || null,
      gender: patient.gender || null,
      person_type: patient.person_type || null,
      father_name: patient.father_name || null,
      mother_name: patient.mother_name || null,
      cns: patient.cns || null,
      marital_status: patient.marital_status || null,
      specialty: patient.specialty || null,
      professional: patient.professional || null,
      health_plan: patient.health_plan || patient.healthPlan || null,
      reception: patient.reception || 'RECEPÇÃO CENTRAL'
    };

    console.log("Saving patient data:", patientData);

    // First try to insert/update the patient
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
    
    // For demo mode without authentication
    if (!supabase.auth.getSession()) {
      console.log("Creating demo patient due to missing authentication");
      return {
        ...patient,
        id: patient.id || `demo-${Math.random().toString(36).substring(2, 9)}`,
        status: 'Agendado',
        specialty: patient.specialty || null,
        professional: patient.professional || null,
        health_plan: patient.health_plan || patient.healthPlan || null
      };
    }
    
    throw error;
  }
};
