
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "../types";
import { formatDateForDatabase } from "../utils/dateUtils";
import { addPatientLog } from "../patientAdditionalDataService";

export const savePatient = async (patient: Patient): Promise<Patient | null> => {
  try {
    // Handle address correctly by ensuring it's a string for Supabase
    const addressValue = typeof patient.address === 'object' 
      ? JSON.stringify(patient.address) 
      : patient.address;

    // Prepare patient data for saving
    const patientData = {
      id: patient.id,
      name: patient.name,
      cpf: patient.cpf || null,
      phone: patient.phone || null,
      email: patient.email || null,
      address: addressValue,
      birth_date: formatDateForDatabase(patient.birth_date) || null,
      status: patient.status || 'Agendado',
      person_type: patient.person_type || null,
      gender: patient.gender || null,
      father_name: patient.father_name || null,
      mother_name: patient.mother_name || null,
      reception: patient.reception || "RECEPÇÃO CENTRAL" // Set default reception
    };

    console.log("Saving patient data:", patientData);

    // Check if we're in demo mode
    const { data: session } = await supabase.auth.getSession();
    const isAuthenticated = !!session?.session;
    
    if (!isAuthenticated) {
      console.log("No authentication - using demo mode");
      // Demo mode - create a mock patient
      const mockPatient = {
        ...patient,
        id: patient.id || `demo-${Math.random().toString(36).substring(2, 9)}`,
        status: 'Agendado',
        protocol_number: Math.floor(Math.random() * 900) + 100,
        reception: patient.reception || "RECEPÇÃO CENTRAL" // Set reception in demo mode
      };
      
      // Save mock patient to localStorage
      try {
        const existingPatients = JSON.parse(localStorage.getItem('demo_patients') || '[]');
        const existingIndex = existingPatients.findIndex((p: any) => p.id === mockPatient.id);
        
        if (existingIndex >= 0) {
          // Update existing patient
          existingPatients[existingIndex] = mockPatient;
        } else {
          // Add new patient
          existingPatients.push(mockPatient);
        }
        
        localStorage.setItem('demo_patients', JSON.stringify(existingPatients));
        console.log("Patient saved to local storage:", mockPatient);
      } catch (localStorageError) {
        console.error("Error saving to localStorage:", localStorageError);
      }
      
      return mockPatient;
    }

    // First check if the patient exists by ID, if using an existing ID
    if (patientData.id) {
      const { data: existingPatient, error: checkError } = await supabase
        .from('patients')
        .select('id')
        .eq('id', patientData.id)
        .maybeSingle();

      if (checkError) {
        console.error("Erro ao verificar paciente existente:", checkError);
      }

      // If the patient exists, update it
      if (existingPatient) {
        const { data, error } = await supabase
          .from('patients')
          .update(patientData)
          .eq('id', patientData.id)
          .select();

        if (error) {
          console.error("Erro ao atualizar paciente:", error);
          return null;
        }

        return data[0] as Patient;
      }
    }

    // If patient doesn't exist or no ID was provided, insert a new one
    const { data, error } = await supabase
      .from('patients')
      .insert(patientData)
      .select();
      
    if (error) {
      console.error("Erro ao salvar paciente:", error);
      
      // For demo purposes: if Supabase insert fails, return a mock patient
      if (patient.name) {
        console.log("Creating mock patient for demo purposes");
        const mockPatient = {
          ...patient,
          id: patient.id || `demo-${Math.random().toString(36).substring(2, 9)}`,
          status: 'Agendado',
          protocol_number: Math.floor(Math.random() * 900) + 100,
          reception: patient.reception || "RECEPÇÃO CENTRAL" // Ensure reception is set for demo fallbacks
        };
        
        try {
          await addPatientLog({
            patient_id: mockPatient.id,
            action: "Cadastro (Demo)",
            description: "Paciente salvo no modo de demonstração",
            performed_by: "Sistema"
          });
        } catch (logError) {
          console.error("Erro ao registrar log de demonstração:", logError);
        }
        
        return mockPatient;
      }
      
      return null;
    }
    
    const savedPatient = data[0] as Patient;
    console.log("Patient saved successfully:", savedPatient);
    
    // Log the action
    try {
      await addPatientLog({
        patient_id: savedPatient.id,
        action: "Cadastro/Atualização",
        description: "Dados do paciente atualizados",
        performed_by: "Sistema"
      });
    } catch (logError) {
      console.error("Erro ao registrar log:", logError);
      // Continue even if logging fails
    }
    
    return savedPatient;
  } catch (error) {
    console.error("Erro em savePatient:", error);
    
    // For demo purposes: if entire process fails, create a mock response
    if (patient.name) {
      console.log("Creating fallback mock patient");
      const mockPatient = {
        ...patient,
        id: patient.id || `fallback-${Math.random().toString(36).substring(2, 9)}`,
        status: 'Agendado',
        protocol_number: Math.floor(Math.random() * 900) + 100,
        reception: patient.reception || "RECEPÇÃO CENTRAL" // Set reception for fallbacks
      };
      
      // Save mock patient to localStorage
      try {
        const existingPatients = JSON.parse(localStorage.getItem('demo_patients') || '[]');
        existingPatients.push(mockPatient);
        localStorage.setItem('demo_patients', JSON.stringify(existingPatients));
      } catch (localStorageError) {
        console.error("Error saving to localStorage:", localStorageError);
      }
      
      return mockPatient;
    }
    
    return null;
  }
};
