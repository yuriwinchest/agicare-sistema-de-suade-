// Remove duplicate Json type
// Ensure VitalSigns is properly defined

export interface VitalSigns {
  temperature?: string;
  pressure?: string;
  pulse?: string;
  respiratory?: string;
  oxygen?: string;
  painScale?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  date?: string;
  time?: string;
}

export interface NursingAssessment {
  id?: string;
  patient_id: string;
  nurse_id?: string;
  procedures?: string[];
  observations?: string;
  vital_signs?: VitalSigns;
  created_at?: string;
  updated_at?: string;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Add offline sync types
export interface OfflineSyncItem {
  id?: string;
  patient_id: string;
  data_type: string;
  data: any;
  timestamp: number;
  synced: boolean;
  created_at?: string;
}
