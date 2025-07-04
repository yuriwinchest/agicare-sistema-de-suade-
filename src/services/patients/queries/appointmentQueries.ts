
import { supabase } from "@/integrations/supabase/client";
import { ensureProperDateFormat } from "../utils/dateUtils";

export const getActiveAppointments = async () => {
  try {
    console.log("Buscando agendamentos ativos...");
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients(*),
        patient_additional_data(*)
      `)
      .in('status', ['scheduled', 'confirmed'])
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error("Error fetching active appointments:", error);
      return [];
    }

    console.log(`Encontrados ${data?.length || 0} agendamentos ativos`);
    console.log("Dados brutos:", data);

    // Format dates and transform data
    const transformedAppointments = (data || []).map(appointment => {
      // Handle empty patient data by using a default object and optional chaining
      const patient = appointment.patients || {};
      const additionalData = appointment.patient_additional_data || {};
      
      // Tratamos explicitamente o objeto como qualquer (any) para evitar erros de tipo
      const patientAny = patient as any;
      const additionalDataAny = additionalData as any;
      
      const transformed = {
        id: appointment.id,
        patient_id: appointment.patient_id,
        date: ensureProperDateFormat(appointment.date) || "Não agendado",
        time: appointment.time || "Não definido",
        name: patientAny.name || "Paciente",
        specialty: additionalDataAny.specialty || patientAny.attendance_type || "Não definida",
        professional: additionalDataAny.professional || "Não definido",
        health_plan: additionalDataAny.health_plan || "Não informado",
        status: appointment.status || "scheduled"
      };
      
      return transformed;
    });

    console.log("Agendamentos transformados:", transformedAppointments);
    return transformedAppointments;
  } catch (error) {
    console.error("Error in getActiveAppointments:", error);
    return [];
  }
};

export const getPatientAppointments = async (patientId: string) => {
  try {
    console.log(`Buscando agendamentos para o paciente ${patientId}`);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false })
      .order('time', { ascending: true });

    if (error) {
      console.error(`Error fetching appointments for patient ${patientId}:`, error);
      return [];
    }

    console.log(`Encontrados ${data?.length || 0} agendamentos para o paciente ${patientId}`);
    
    // Format dates for display
    const formattedAppointments = (data || []).map(appointment => ({
      ...appointment,
      date: ensureProperDateFormat(appointment.date)
    }));

    console.log("Agendamentos formatados:", formattedAppointments);
    return formattedAppointments;
  } catch (error) {
    console.error(`Error in getPatientAppointments for ${patientId}:`, error);
    return [];
  }
};
