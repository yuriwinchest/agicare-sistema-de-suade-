
import { supabase } from "@/integrations/supabase/client";
import { ensureProperDateFormat } from "../utils/dateUtils";

export const getActiveAppointments = async () => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients(*)
      `)
      .in('status', ['scheduled', 'confirmed'])
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error("Error fetching active appointments:", error);
      return [];
    }

    // Format dates and transform data
    return (data || []).map(appointment => {
      // Handle empty patient data by using a default object and optional chaining
      const patient = appointment.patients || {};
      
      // Tratamos explicitamente o objeto patient como qualquer (any) para evitar erros de tipo
      const patientAny = patient as any;
      
      return {
        id: appointment.id,
        patient_id: appointment.patient_id,
        date: ensureProperDateFormat(appointment.date) || "Não agendado",
        time: appointment.time || "Não definido",
        name: patientAny.name || "Paciente",
        specialty: patientAny.specialty || "Não definida",
        professional: patientAny.professional || "Não definido",
        health_plan: patientAny.health_plan || "Não informado",
        status: appointment.status || "scheduled"
      };
    });
  } catch (error) {
    console.error("Error in getActiveAppointments:", error);
    return [];
  }
};

export const getPatientAppointments = async (patientId: string) => {
  try {
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

    // Format dates for display
    return (data || []).map(appointment => ({
      ...appointment,
      date: ensureProperDateFormat(appointment.date)
    }));
  } catch (error) {
    console.error(`Error in getPatientAppointments for ${patientId}:`, error);
    return [];
  }
};
