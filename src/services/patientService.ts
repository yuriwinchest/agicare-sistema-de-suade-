
// Mock database/storage for patients
let patients: any[] = [
  { id: "001", name: "Carlos Ferreira", cpf: "123.456.789-01", phone: "(11) 98765-4321", reception: "RECEPÇÃO CENTRAL", date: "07/05/2024", time: "14:30", status: "Agendado" },
  { id: "002", name: "Maria Silva", cpf: "987.654.321-09", phone: "(11) 91234-5678", reception: "RECEPÇÃO CENTRAL", date: "07/05/2024", time: "15:00", status: "Confirmado" },
  { id: "003", name: "João Santos", cpf: "456.789.123-45", phone: "(11) 97890-1234", reception: "RECEPÇÃO CENTRAL", date: "07/05/2024", time: "15:30", status: "Aguardando" },
  { id: "004", name: "Ana Oliveira", cpf: "789.123.456-78", phone: "(11) 94567-8901", reception: "RECEPÇÃO CENTRAL", date: "07/05/2024", time: "16:00", status: "Confirmado" },
];

// Get all patients
export const getPatients = () => {
  return patients;
};

// Get patient by ID
export const getPatientById = (id: string) => {
  return patients.find(patient => patient.id === id);
};

// Save new patient or update existing one
export const savePatient = (patient: any) => {
  const existingPatientIndex = patients.findIndex(p => p.id === patient.id);
  
  if (existingPatientIndex >= 0) {
    patients[existingPatientIndex] = { ...patients[existingPatientIndex], ...patient };
  } else {
    // Add reception and date fields for new patients
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const date = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    
    patients.push({ 
      ...patient, 
      reception: "RECEPÇÃO CENTRAL",
      date,
      time
    });
  }
  
  return patient;
};

// Update patient status and send to ambulatory
export const confirmPatientAppointment = (patientId: string, appointmentData: any) => {
  const patientIndex = patients.findIndex(p => p.id === patientId);
  
  if (patientIndex >= 0) {
    patients[patientIndex] = { 
      ...patients[patientIndex], 
      ...appointmentData,
      status: "Aguardando" 
    };
    
    // Update ambulatory list (simulating database relation)
    updateAmbulatoryPatient(patients[patientIndex]);
    
    return patients[patientIndex];
  }
  
  return null;
};

// Mock ambulatory patients storage
let ambulatoryPatients: any[] = [
  { id: "001", name: "Carlos Ferreira", priority: "Urgente", time: "09:15", triage: { temp: "38.5°C", pressure: "130/85", symptoms: "Febre, dor abdominal" } },
  { id: "002", name: "Mariana Costa", priority: "Normal", time: "09:30", triage: { temp: "36.8°C", pressure: "120/80", symptoms: "Dor de cabeça" } },
];

// Get all ambulatory patients
export const getAmbulatoryPatients = () => {
  return ambulatoryPatients;
};

// Update or add patient to ambulatory
export const updateAmbulatoryPatient = (patient: any) => {
  const existingIndex = ambulatoryPatients.findIndex(p => p.id === patient.id);
  
  if (existingIndex >= 0) {
    ambulatoryPatients[existingIndex] = { ...ambulatoryPatients[existingIndex], ...patient };
  } else {
    // Convert reception patient to ambulatory format
    ambulatoryPatients.push({
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
  
  return patient;
};
