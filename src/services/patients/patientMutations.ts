
import { supabase } from "@/integrations/supabase/client";
import { Patient, PatientDraft } from "./types";

export const savePatient = async (patient: Patient): Promise<Patient> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .upsert({
        id: patient.id,
        name: patient.name,
        cpf: patient.cpf,
        phone: patient.phone,
        email: patient.email,
        address: patient.address,
        birth_date: patient.birth_date,
        status: patient.status
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao salvar paciente:", error);
    throw error;
  }
};

export const updatePatientRedirection = async (patientId: string, destination: string) => {
  try {
    const { error } = await supabase
      .from('patients')
      .update({
        status: destination,
        redirected: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', patientId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erro ao atualizar redirecionamento do paciente:", error);
    return false;
  }
};

export const confirmPatientAppointment = async (patientId: string, appointmentData: any) => {
  try {
    const { error } = await supabase
      .from('patients')
      .update({
        status: appointmentData.status,
        specialty: appointmentData.specialty,
        professional: appointmentData.professional,
        updated_at: new Date().toISOString()
      })
      .eq('id', patientId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erro ao confirmar consulta do paciente:", error);
    return false;
  }
};
