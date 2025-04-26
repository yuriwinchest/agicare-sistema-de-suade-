
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "../types";
import { isDemoMode } from "../utils/demoUtils";
import { addPatientLog } from "@/services/patients/patientAdditionalDataService";

export const savePatient = async (patient: Patient): Promise<Patient | null> => {
  try {
    if (await isDemoMode()) {
      console.log("Demo mode detected - using localStorage for patients");
      const mockPatient = {
        ...patient,
        id: patient.id || `demo-${Math.random().toString(36).substring(2, 9)}`,
        status: 'Agendado'
      };
      
      try {
        const existingPatients = JSON.parse(localStorage.getItem('demo_patients') || '[]');
        const existingIndex = existingPatients.findIndex((p: any) => p.id === mockPatient.id);
        
        if (existingIndex >= 0) {
          existingPatients[existingIndex] = mockPatient;
        } else {
          existingPatients.push(mockPatient);
        }
        
        localStorage.setItem('demo_patients', JSON.stringify(existingPatients));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
      
      return mockPatient;
    }

    const patientData = {
      ...patient,
      status: patient.status || 'Agendado'
    };
    
    const { data, error } = await supabase
      .from('patients')
      .upsert(patientData)
      .select()
      .single();
      
    if (error) {
      console.error("Error saving patient:", error);
      return null;
    }
    
    const savedPatient = data as Patient;
    
    await addPatientLog({
      patient_id: savedPatient.id,
      action: "Cadastro/Atualização",
      description: "Dados do paciente atualizados",
      performed_by: "Sistema"
    });
    
    return savedPatient;
  } catch (error) {
    console.error("Error in savePatient:", error);
    return null;
  }
};
