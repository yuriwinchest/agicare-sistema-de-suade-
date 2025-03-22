
// Mock database/storage for patients
let patients: any[] = [
  { id: "001", name: "Carlos Ferreira", cpf: "123.456.789-01", phone: "(11) 98765-4321", reception: "RECEPÇÃO CENTRAL", date: "07/05/2024", time: "14:30", status: "Agendado" },
  { id: "002", name: "Maria Silva", cpf: "987.654.321-09", phone: "(11) 91234-5678", reception: "RECEPÇÃO CENTRAL", date: "07/05/2024", time: "15:00", status: "Confirmado" },
  { id: "003", name: "João Santos", cpf: "456.789.123-45", phone: "(11) 97890-1234", reception: "RECEPÇÃO CENTRAL", date: "07/05/2024", time: "15:30", status: "Aguardando" },
  { id: "004", name: "Ana Oliveira", cpf: "789.123.456-78", phone: "(11) 94567-8901", reception: "RECEPÇÃO CENTRAL", date: "07/05/2024", time: "16:00", status: "Confirmado" },
];

// Initialize from localStorage if available
const initFromLocalStorage = () => {
  try {
    const storedPatients = localStorage.getItem('patients');
    if (storedPatients) {
      patients = JSON.parse(storedPatients);
    }
  } catch (error) {
    console.error("Error loading patients from localStorage:", error);
  }
};

// Save to localStorage
const saveToLocalStorage = () => {
  try {
    localStorage.setItem('patients', JSON.stringify(patients));
  } catch (error) {
    console.error("Error saving patients to localStorage:", error);
  }
};

// Initialize on service load
initFromLocalStorage();

// Get all patients
export const getPatients = () => {
  // Always refresh from localStorage first to ensure we have the latest data
  initFromLocalStorage();
  return patients;
};

// Get patient by ID
export const getPatientById = (id: string) => {
  // Always refresh from localStorage first
  initFromLocalStorage();
  return patients.find(patient => patient.id === id);
};

// Generate a unique ID
const generateUniqueId = () => {
  // Get the last ID in the patients array and increment it
  if (patients.length === 0) {
    return "001";
  }
  
  // Extract the highest numeric ID and increment by 1
  const highestId = Math.max(...patients.map(p => parseInt(p.id)));
  return (highestId + 1).toString().padStart(3, '0');
};

// Save new patient or update existing one
export const savePatient = (patient: any) => {
  // Always refresh from localStorage first
  initFromLocalStorage();
  
  const existingPatientIndex = patients.findIndex(p => p.id === patient.id);
  
  if (existingPatientIndex >= 0) {
    // Update existing patient
    patients[existingPatientIndex] = { ...patients[existingPatientIndex], ...patient };
  } else {
    // Generate a new ID if none exists
    const newPatient = { ...patient };
    if (!newPatient.id) {
      newPatient.id = generateUniqueId();
    }
    
    // Add reception and date fields for new patients
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const date = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    
    // Set default status for new patients
    if (!newPatient.status) {
      newPatient.status = "Agendado";
    }
    
    // Add new patient to the beginning of the array
    patients.unshift({ 
      ...newPatient, 
      reception: "RECEPÇÃO CENTRAL",
      date,
      time
    });
  }
  
  // Save to localStorage
  saveToLocalStorage();
  
  // Return the patient (with the new ID if it was just created)
  return patients.find(p => p.cpf === patient.cpf) || patient;
};

// Save draft patient data (during form filling)
export const saveDraftPatient = (patientData: any) => {
  try {
    localStorage.setItem('draftPatient', JSON.stringify(patientData));
    return true;
  } catch (error) {
    console.error("Error saving draft patient:", error);
    return false;
  }
};

// Load draft patient data
export const loadDraftPatient = () => {
  try {
    const draft = localStorage.getItem('draftPatient');
    if (draft) {
      return JSON.parse(draft);
    }
  } catch (error) {
    console.error("Error loading draft patient:", error);
  }
  return null;
};

// Clear draft patient data
export const clearDraftPatient = () => {
  try {
    localStorage.removeItem('draftPatient');
    return true;
  } catch (error) {
    console.error("Error clearing draft patient:", error);
    return false;
  }
};

// Update patient status and send to ambulatory
export const confirmPatientAppointment = (patientId: string, appointmentData: any) => {
  // Always refresh from localStorage first
  initFromLocalStorage();
  
  const patientIndex = patients.findIndex(p => p.id === patientId);
  
  if (patientIndex >= 0) {
    patients[patientIndex] = { 
      ...patients[patientIndex], 
      ...appointmentData,
      status: "Aguardando" 
    };
    
    // Update ambulatory list (simulating database relation)
    updateAmbulatoryPatient(patients[patientIndex]);
    
    // Save to localStorage
    saveToLocalStorage();
    
    return patients[patientIndex];
  }
  
  return null;
};

// Mock ambulatory patients storage
let ambulatoryPatients: any[] = [
  { id: "001", name: "Carlos Ferreira", priority: "Urgente", time: "09:15", triage: { temp: "38.5°C", pressure: "130/85", symptoms: "Febre, dor abdominal" } },
  { id: "002", name: "Mariana Costa", priority: "Normal", time: "09:30", triage: { temp: "36.8°C", pressure: "120/80", symptoms: "Dor de cabeça" } },
];

// Initialize ambulatory patients from localStorage if available
const initAmbulatoryFromLocalStorage = () => {
  try {
    const storedPatients = localStorage.getItem('ambulatoryPatients');
    if (storedPatients) {
      ambulatoryPatients = JSON.parse(storedPatients);
    }
  } catch (error) {
    console.error("Error loading ambulatory patients from localStorage:", error);
  }
};

// Save ambulatory patients to localStorage
const saveAmbulatoryToLocalStorage = () => {
  try {
    localStorage.setItem('ambulatoryPatients', JSON.stringify(ambulatoryPatients));
  } catch (error) {
    console.error("Error saving ambulatory patients to localStorage:", error);
  }
};

// Initialize on service load
initAmbulatoryFromLocalStorage();

// Get all ambulatory patients
export const getAmbulatoryPatients = () => {
  // Always refresh from localStorage
  initAmbulatoryFromLocalStorage();
  return ambulatoryPatients;
};

// Update or add patient to ambulatory
export const updateAmbulatoryPatient = (patient: any) => {
  // Always refresh from localStorage
  initAmbulatoryFromLocalStorage();
  
  const existingIndex = ambulatoryPatients.findIndex(p => p.id === patient.id);
  
  if (existingIndex >= 0) {
    ambulatoryPatients[existingIndex] = { ...ambulatoryPatients[existingIndex], ...patient };
  } else {
    // Convert reception patient to ambulatory format
    ambulatoryPatients.unshift({
      id: patient.id,
      name: patient.name,
      priority: "Normal",
      time: patient.time,
      specialty: patient.specialty,
      professional: patient.professional,
      triage: { 
        temp: "36.5°C", 
        pressure: "120/80", 
        symptoms: patient.observations || "Sem sintomas relatados" 
      }
    });
  }
  
  // Save to localStorage
  saveAmbulatoryToLocalStorage();
  
  return patient;
};
