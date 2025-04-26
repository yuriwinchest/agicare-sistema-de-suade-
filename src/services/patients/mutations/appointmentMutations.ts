
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { addPatientLog } from "@/services/patients/patientAdditionalDataService";

export const confirmPatientAppointment = async (id: string, appointmentData: any) => {
  try {
    const today = new Date();
    const formattedDate = format(today, "dd/MM/yyyy");

    const { data: patientData, error: updateError } = await supabase
      .from('patients')
      .update({
        status: 'Confirmado',
        attendance_type: appointmentData.attendanceType,
        specialty: appointmentData.specialty,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating patient:", updateError);
      throw updateError;
    }

    // Add log entry
    await addPatientLog({
      patient_id: id,
      action: "Confirmação",
      description: "Agendamento confirmado",
      performed_by: "Sistema"
    });
    
    return patientData;
  } catch (error) {
    console.error("Error in confirmPatientAppointment:", error);
    return null;
  }
};
