
import { supabase } from "@/services/supabaseClient";
import { HospitalizedPatient, Patient } from "./types";

export const getPatientById = async (id: string): Promise<Patient | null> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
      
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
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('name');
      
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

// Additional query functions
export const getAmbulatoryPatients = async (): Promise<Patient[]> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('status', 'active')
      .order('name');
      
    if (error) {
      console.error("Error fetching ambulatory patients:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAmbulatoryPatients:", error);
    return [];
  }
};

export const getHospitalizedPatients = async (): Promise<HospitalizedPatient[]> => {
  try {
    // Simulated query - in a real app, would query with hospitalization status
    const { data, error } = await supabase
      .from('patients')
      .select('*, medical_records(doctor:health_professionals(name), diagnosis)')
      .eq('status', 'hospitalized')
      .order('name');
      
    if (error) {
      console.error("Error fetching hospitalized patients:", error);
      return [];
    }
    
    // Format data for the UI
    return (data || []).map(patient => ({
      ...patient,
      unit: 'A', // Mock data
      bed: 'A-101', // Mock data
      doctor: patient.medical_records?.[0]?.doctor?.name || 'Not assigned',
      diagnosis: patient.medical_records?.[0]?.diagnosis || 'Under evaluation',
      admissionDate: new Date().toISOString().split('T')[0] // Mock data
    }));
  } catch (error) {
    console.error("Error in getHospitalizedPatients:", error);
    return [];
  }
};

export const getActiveAppointments = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patient:patients(*)')
      .in('status', ['scheduled', 'confirmed'])
      .order('date', { ascending: true });
      
    if (error) {
      console.error("Error fetching active appointments:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getActiveAppointments:", error);
    return [];
  }
};

// Alias for compatibility
export const getActiveAppointmentsAsync = getActiveAppointments;
export const getPatientByIdAsync = getPatientById;
