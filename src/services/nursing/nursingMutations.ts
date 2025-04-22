
import { supabase } from "@/integrations/supabase/client";
import { VitalSigns, NursingEvolution, HydricBalance } from "./types";

export const saveVitalSigns = async (patientId: string, data: VitalSigns): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('nursing_records')
      .upsert({
        patient_id: patientId,
        vital_signs: data,
        updated_at: new Date().toISOString()
      });
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erro ao salvar sinais vitais:", error);
    return false;
  }
};

export const saveNursingEvolution = async (patientId: string, data: NursingEvolution): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('nursing_records')
      .upsert({
        patient_id: patientId,
        evolution: data,
        updated_at: new Date().toISOString()
      });
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erro ao salvar evolução:", error);
    return false;
  }
};

export const saveHydricBalance = async (patientId: string, data: HydricBalance): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('nursing_records')
      .upsert({
        patient_id: patientId,
        hydric_balance: data,
        updated_at: new Date().toISOString()
      });
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erro ao salvar balanço hídrico:", error);
    return false;
  }
};
