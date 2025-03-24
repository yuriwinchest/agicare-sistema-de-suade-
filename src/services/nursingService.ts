
import { getPatientById, savePatient } from "./patientService";

// Interfaces para tipagem dos dados
interface VitalSigns {
  temperature: string;
  pressure: string;
  pulse: string;
  respiratory: string;
  oxygen: string;
}

interface AnamnesisData {
  mainComplaint: string;
  history: string;
  allergies: string;
  medications: string;
}

interface NursingAssessmentData {
  vitalSigns?: VitalSigns;
  anamnesis?: AnamnesisData;
  status?: string;
  lastUpdate?: string;
  completedBy?: string;
}

// Salvar sinais vitais para um paciente
export const saveVitalSigns = (patientId: string, vitalSigns: VitalSigns): boolean => {
  try {
    // Sanitizar dados
    Object.keys(vitalSigns).forEach(key => {
      const k = key as keyof VitalSigns;
      if (typeof vitalSigns[k] === 'string') {
        // Remove caracteres potencialmente perigosos
        vitalSigns[k] = vitalSigns[k].replace(/<[^>]*>?/gm, '');
      }
    });
    
    // Buscar paciente atual
    const patient = getPatientById(patientId);
    if (!patient) return false;
    
    // Atualizar dados de enfermagem
    const nursingData = patient.nursingData || {};
    nursingData.vitalSigns = vitalSigns;
    nursingData.lastUpdate = new Date().toISOString();
    
    // Salvar paciente atualizado
    savePatient({
      ...patient,
      nursingData
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao salvar sinais vitais:", error);
    return false;
  }
};

// Salvar anamnese para um paciente
export const saveAnamnesis = (patientId: string, anamnesis: AnamnesisData): boolean => {
  try {
    // Sanitizar dados
    Object.keys(anamnesis).forEach(key => {
      const k = key as keyof AnamnesisData;
      if (typeof anamnesis[k] === 'string') {
        // Remove caracteres potencialmente perigosos
        anamnesis[k] = anamnesis[k].replace(/<[^>]*>?/gm, '');
      }
    });
    
    // Buscar paciente atual
    const patient = getPatientById(patientId);
    if (!patient) return false;
    
    // Atualizar dados de enfermagem
    const nursingData = patient.nursingData || {};
    nursingData.anamnesis = anamnesis;
    nursingData.lastUpdate = new Date().toISOString();
    
    // Salvar paciente atualizado
    savePatient({
      ...patient,
      nursingData
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao salvar anamnese:", error);
    return false;
  }
};

// Completar avaliação de enfermagem
export const completeNursingAssessment = (patientId: string, nurseData: {name: string}): boolean => {
  try {
    // Buscar paciente atual
    const patient = getPatientById(patientId);
    if (!patient) return false;
    
    // Atualizar dados de enfermagem
    const nursingData = patient.nursingData || {};
    nursingData.completedBy = nurseData.name;
    nursingData.lastUpdate = new Date().toISOString();
    
    // Atualizar status do paciente
    savePatient({
      ...patient,
      nursingData,
      status: "Avaliado" // Status após completar a avaliação de enfermagem
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao finalizar avaliação de enfermagem:", error);
    return false;
  }
};

// Obter dados da enfermagem para um paciente
export const getNursingAssessment = (patientId: string): NursingAssessmentData | null => {
  try {
    const patient = getPatientById(patientId);
    if (!patient) return null;
    
    return patient.nursingData || {};
  } catch (error) {
    console.error("Erro ao obter dados de enfermagem:", error);
    return null;
  }
};
