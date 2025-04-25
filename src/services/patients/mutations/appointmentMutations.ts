
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { addPatientLog } from "@/services/patients/patientAdditionalDataService";

export const confirmPatientAppointment = async (id: string, appointmentData: any) => {
  try {
    console.log("Confirming appointment with data:", { id, appointmentData });

    const { 
      attendanceType, professional, specialty, healthPlan, 
      healthCardNumber, observations, appointmentTime, status 
    } = appointmentData;

    if (!attendanceType || !professional || !specialty) {
      console.error("Missing required appointment data:", { attendanceType, professional, specialty });
      throw new Error("Dados de atendimento incompletos");
    }

    const today = new Date();
    const formattedDate = format(today, "dd/MM/yyyy");

    // Update patient record with appointment data
    const { data: patientData, error: updateError } = await supabase
      .from('patients')
      .update({
        status: status || "Enfermagem",
        attendance_type: attendanceType,
        specialty: specialty,
        professional: professional,
        health_plan: healthPlan,
        appointmentTime: appointmentTime,
        date: formattedDate,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (updateError) {
      console.error("Error updating patient in Supabase:", updateError);
      throw updateError;
    }

    // Store additional data
    try {
      const { data: existingData } = await supabase
        .from('patient_additional_data')
        .select('id')
        .eq('id', id)
        .maybeSingle();

      if (existingData) {
        await supabase
          .from('patient_additional_data')
          .update({
            health_card_number: healthCardNumber || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
      } else {
        await supabase
          .from('patient_additional_data')
          .insert({
            id: id,
            health_card_number: healthCardNumber || null
          });
      }
    } catch (additionalDataError) {
      console.error("Error handling patient additional data:", additionalDataError);
    }

    // Add observations if provided
    if (observations) {
      try {
        await supabase
          .from('patient_notes')
          .insert({
            patient_id: id,
            notes: observations,
            created_by: "Recepção"
          });
      } catch (notesError) {
        console.error("Error saving observations:", notesError);
      }
    }

    // Add log entry
    try {
      await addPatientLog({
        patient_id: id,
        action: "Consulta Registrada",
        description: `Paciente encaminhado para ${status || "Enfermagem"} - ${specialty} com ${professional}. Tipo: ${attendanceType} - Data: ${formattedDate}`,
        performed_by: "Recepção"
      });
    } catch (logError) {
      console.error("Error registering log:", logError);
    }

    return patientData;
  } catch (error) {
    console.error("Exception in confirmPatientAppointment:", error);
    throw error;
  }
};
