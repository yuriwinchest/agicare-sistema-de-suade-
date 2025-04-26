
import { supabase } from "@/integrations/supabase/client";
import { isDemoMode } from "../utils/demoUtils";

export const getActiveAppointments = async () => {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Return mock appointments in demo mode
      return [
        {
          id: "demo-1",
          patient: { name: "João Silva" },
          date: new Date().toISOString().split('T')[0],
          time: "09:00:00",
          specialty: "Clínica Médica",
          professional: "Dr. Carlos Santos",
          health_plan: "Unimed",
          status: "confirmed",
          notes: "Retorno após exames"
        },
        {
          id: "demo-2",
          patient: { name: "Maria Oliveira" },
          date: new Date().toISOString().split('T')[0],
          time: "10:30:00",
          specialty: "Cardiologia",
          professional: "Dra. Ana Sousa",
          health_plan: "Amil",
          status: "scheduled",
          notes: "Primeira consulta"
        },
        {
          id: "demo-3",
          patient: { name: "Pedro Costa" },
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
          time: "14:00:00",
          specialty: "Ortopedia",
          professional: "Dr. Roberto Almeida",
          health_plan: "SulAmérica",
          status: "confirmed",
          notes: null
        }
      ];
    }

    // Get appointments with patient information
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patient_id(id, name)
      `)
      .in('status', ['scheduled', 'confirmed'])
      .order('date', { ascending: true });

    if (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getActiveAppointments:", error);
    return [];
  }
};

// Get appointments for a specific patient
export const getPatientAppointments = async (patientId: string) => {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Return mock appointments for this patient in demo mode
      return [
        {
          id: "demo-appt-1",
          date: new Date().toISOString().split('T')[0],
          time: "09:00:00",
          specialty: "Clínica Médica",
          professional: "Dr. Carlos Santos",
          status: "confirmed"
        }
      ];
    }

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false });

    if (error) {
      console.error("Error fetching patient appointments:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getPatientAppointments:", error);
    return [];
  }
};
