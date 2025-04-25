
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { addPatientLog } from "@/services/patients/patientAdditionalDataService";

export const confirmPatientAppointment = async (id: string, appointmentData: any) => {
  try {
    // Extraindo os dados
    const { 
      attendanceType, professional, specialty, healthPlan, 
      healthCardNumber, observations, appointmentTime, status 
    } = appointmentData;

    // Formatando a data atual para exibição
    const today = new Date();
    const formattedDate = format(today, "dd/MM/yyyy");

    // Atualizando o paciente com todos os dados de atendimento
    const { data, error } = await supabase
      .from('patients')
      .update({
        status: status || "Enfermagem",
        specialty: specialty,
        professional: professional,
        date: formattedDate,
        time: appointmentTime,
        reception: "Ambulatório",
        health_plan: healthPlan,
        health_card_number: healthCardNumber,
        attendance_type: attendanceType,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao confirmar atendimento:", error);
      throw error;
    }

    // Registrando o log do paciente
    try {
      await addPatientLog({
        patient_id: id,
        action: "Consulta Registrada",
        description: `Paciente encaminhado para ${status || "Enfermagem"} - ${specialty} com ${professional}`,
        performed_by: "Recepção"
      });
    } catch (logError) {
      console.error("Erro ao registrar log:", logError);
      // Continuar mesmo se o log falhar
    }

    // Registrando observações se houver
    if (observations) {
      try {
        const { error: notesError } = await supabase
          .from('patient_notes')
          .insert({
            patient_id: id,
            notes: observations,
            created_by: "Recepção"
          });

        if (notesError) {
          console.error("Erro ao salvar observações:", notesError);
        }
      } catch (notesError) {
        console.error("Erro ao registrar observações:", notesError);
      }
    }

    return data;
  } catch (error) {
    console.error("Erro em confirmPatientAppointment:", error);
    throw error;
  }
};
