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
    
    // Store professional and specialty info in additional data table
    try {
      // First check if a record already exists
      const { data: existingData } = await supabase
        .from('patient_additional_data')
        .select('id')
        .eq('id', id)
        .maybeSingle();

      if (existingData) {
        // Update existing record
        const { error: additionalError } = await supabase
          .from('patient_additional_data')
          .update({
            health_plan: healthPlan || null,
            health_card_number: healthCardNumber || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        if (additionalError) {
          console.error("Error updating patient additional data:", additionalError);
        }
      } else {
        // Insert new record
        const { error: additionalError } = await supabase
          .from('patient_additional_data')
          .insert({
            id: id,
            health_plan: healthPlan || null,
            health_card_number: healthCardNumber || null
          });

        if (additionalError) {
          console.error("Error inserting patient additional data:", additionalError);
        }
      }
    } catch (additionalDataError) {
      console.error("Error handling patient additional data:", additionalDataError);
      // Continue even if this part fails
    }
    
    // Update patient record with only the fields that exist in the patients table
    // Using maybeSingle() instead of single() to handle cases where the record might not exist
    const { data, error } = await supabase
      .from('patients')
      .update({
        status: status || "Enfermagem",
        attendance_type: attendanceType,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error("Error updating patient in Supabase:", error);
      throw error;
    }

    // Get the updated patient data
    let updatedPatient = null;
    if (data && data.length > 0) {
      updatedPatient = data[0];
      console.log("Patient update successful:", updatedPatient);
    } else {
      console.warn("No patient record was updated or returned");
    }

    // Store specialty and professional info in patient_notes to keep this data
    if (specialty || professional) {
      try {
        const noteContent = `Especialidade: ${specialty}, Profissional: ${professional}`;
        
        const { error: notesError } = await supabase
          .from('patient_notes')
          .insert({
            patient_id: id,
            notes: noteContent,
            created_by: "Sistema (Recepção)"
          });

        if (notesError) {
          console.error("Error saving specialty and professional info:", notesError);
        } else {
          console.log("Specialty and professional info saved successfully");
        }
      } catch (notesError) {
        console.error("Exception when saving specialty and professional info:", notesError);
      }
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

    return updatedPatient || { id }; // Return at least the ID if no full patient data
  } catch (error) {
    console.error("Exception in confirmPatientAppointment:", error);
    throw error;
  }
};
