
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { addPatientLog } from "@/services/patients/patientAdditionalDataService";

export const confirmPatientAppointment = async (id: string, appointmentData: any) => {
  try {
    // Log the incoming data for debugging
    console.log("Confirming appointment with data:", { id, appointmentData });

    // Extracting the data
    const { 
      attendanceType, professional, specialty, healthPlan, 
      healthCardNumber, observations, appointmentTime, status 
    } = appointmentData;

    // Validate required data
    if (!attendanceType || !professional || !specialty) {
      console.error("Missing required appointment data:", { attendanceType, professional, specialty });
      throw new Error("Dados de atendimento incompletos");
    }

    // Formatting the date for display in logs and descriptions only
    const today = new Date();
    const formattedDate = format(today, "dd/MM/yyyy");

    console.log("Updating patient with ID:", id);
    
    // Update patient record - removing the 'date' field that doesn't exist in the schema
    const { data, error } = await supabase
      .from('patients')
      .update({
        status: status || "Enfermagem",
        specialty: specialty,
        professional: professional,
        // Removed 'date' field that was causing the error
        time: appointmentTime || format(today, "HH:mm"),
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
      console.error("Error updating patient in Supabase:", error);
      throw error;
    }

    console.log("Patient update successful:", data);

    // Registering the log
    try {
      await addPatientLog({
        patient_id: id,
        action: "Consulta Registrada",
        description: `Paciente encaminhado para ${status || "Enfermagem"} - ${specialty} com ${professional}. Tipo: ${attendanceType} - Data: ${formattedDate}`,
        performed_by: "Recepção"
      });
      
      console.log("Patient log added successfully");
    } catch (logError) {
      console.error("Error registering log:", logError);
      // Continue even if logging fails
    }

    // Register observations if provided
    if (observations) {
      try {
        console.log("Saving observations:", observations);
        
        const { error: notesError } = await supabase
          .from('patient_notes')
          .insert({
            patient_id: id,
            notes: observations,
            created_by: "Recepção"
          });

        if (notesError) {
          console.error("Error saving observations:", notesError);
        } else {
          console.log("Observations saved successfully");
        }
      } catch (notesError) {
        console.error("Exception when saving observations:", notesError);
      }
    }

    return data;
  } catch (error) {
    console.error("Exception in confirmPatientAppointment:", error);
    throw error;
  }
};
