
import { Json } from "@/integrations/supabase/types";

export interface VitalSigns {
  temperature: number;
  systolicPressure: number;
  diastolicPressure: number;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  painScale: number;
  bloodGlucose: number;
  date?: string;
  time?: string;
}

export interface NursingAssessment {
  id: string;
  patient_id: string;
  nurse_id: string;
  procedures?: string[];
  observations?: string;
  vital_signs?: VitalSigns;
  created_at?: string;
  updated_at?: string;
}

// Make sure the Json type extends VitalSigns for Supabase compatibility
declare module "@/integrations/supabase/types" {
  interface Json {
    [key: string]: any;
  }
}
