
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "../types";
import { addPatientLog } from "@/services/patients/patientAdditionalDataService";

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
