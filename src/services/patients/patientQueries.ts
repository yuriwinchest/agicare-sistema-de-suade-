// This file is deprecated and is no longer being used
// All query functions have been moved to ./queries/patientQueries.ts
// Keeping this file for reference only

import { Patient } from "./types";
import { supabase } from "@/integrations/supabase/client";

// Export query functions for patients
export const getPatientById = async (id: string): Promise<Patient | null> => {
  console.warn("Using deprecated patientQueries.ts file. This should be updated to use ./queries/patientQueries.ts");
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching patient:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getPatientById:", error);
    return null;
  }
};

export const getAllPatients = async (): Promise<Patient[]> => {
  console.warn("Using deprecated patientQueries.ts file. This should be updated to use ./queries/patientQueries.ts");
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) {
      console.error("Error fetching patients:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAllPatients:", error);
    return [];
  }
};
