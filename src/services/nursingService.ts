
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

interface PhysicalExamData {
  generalState: string;
  skin: string;
  head: string;
  eyes: string;
  ears: string;
  nose: string;
  mouth: string;
  neck: string;
  chest: string;
  abdomen: string;
  extremities: string;
  neurological: string;
  consciousness: string;
  additional: string;
}

interface HydricBalanceEntry {
  id: string;
  date: string;
  time: string;
  type: string;
  administeredValue?: string;
  eliminationValue?: string;
  description?: string;
}

interface HydricBalanceData {
  entries: HydricBalanceEntry[];
  total: {
    intake: number;
    output: number;
    balance: number;
  };
  date: string;
}

interface NursingEvolutionData {
  date: string;
  time: string;
  evolution: string;
  previousEvolutions?: any[];
}

interface ProcedureData {
  procedures: {
    id: string;
    date: string;
    time: string;
    procedure: string;
    details?: string;
    status: string;
    completedAt?: string;
  }[];
}

interface MedicationData {
  medications: {
    id: string;
    date: string;
    time: string;
    medication: string;
    dose: string;
    route: string;
    observations?: string;
    status: string;
    administered: boolean;
    checkedAt?: string;
  }[];
}

interface NursingAssessmentData {
  vitalSigns?: VitalSigns;
  anamnesis?: AnamnesisData;
  physicalExam?: PhysicalExamData;
  hydricBalance?: HydricBalanceData;
  evolution?: NursingEvolutionData;
  procedures?: ProcedureData;
  medication?: MedicationData;
  status?: string;
  lastUpdate?: string;
  completedBy?: string;
}

// Salvar sinais vitais para um paciente
export const saveVitalSigns = async (patientId: string, vitalSigns: VitalSigns): Promise<boolean> => {
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
    const patient = await getPatientById(patientId);
    if (!patient) return false;
    
    // Atualizar dados de enfermagem
    const nursingData = patient.nursingData || {};
    nursingData.vitalSigns = vitalSigns;
    nursingData.lastUpdate = new Date().toISOString();
    
    // Salvar paciente atualizado
    await savePatient({
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
export const saveAnamnesis = async (patientId: string, anamnesis: AnamnesisData): Promise<boolean> => {
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
    const patient = await getPatientById(patientId);
    if (!patient) return false;
    
    // Atualizar dados de enfermagem
    const nursingData = patient.nursingData || {};
    nursingData.anamnesis = anamnesis;
    nursingData.lastUpdate = new Date().toISOString();
    
    // Salvar paciente atualizado
    await savePatient({
      ...patient,
      nursingData
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao salvar anamnese:", error);
    return false;
  }
};

// Salvar exame físico para um paciente
export const savePhysicalExam = async (patientId: string, physicalExam: PhysicalExamData): Promise<boolean> => {
  try {
    // Sanitizar dados
    Object.keys(physicalExam).forEach(key => {
      const k = key as keyof PhysicalExamData;
      if (typeof physicalExam[k] === 'string') {
        physicalExam[k] = physicalExam[k].replace(/<[^>]*>?/gm, '');
      }
    });
    
    // Buscar paciente atual
    const patient = await getPatientById(patientId);
    if (!patient) return false;
    
    // Atualizar dados de enfermagem
    const nursingData = patient.nursingData || {};
    nursingData.physicalExam = physicalExam;
    nursingData.lastUpdate = new Date().toISOString();
    
    // Salvar paciente atualizado
    await savePatient({
      ...patient,
      nursingData
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao salvar exame físico:", error);
    return false;
  }
};

// Salvar balanço hídrico para um paciente
export const saveHydricBalance = async (patientId: string, hydricBalance: HydricBalanceData): Promise<boolean> => {
  try {
    // Buscar paciente atual
    const patient = await getPatientById(patientId);
    if (!patient) return false;
    
    // Atualizar dados de enfermagem
    const nursingData = patient.nursingData || {};
    nursingData.hydricBalance = hydricBalance;
    nursingData.lastUpdate = new Date().toISOString();
    
    // Salvar paciente atualizado
    await savePatient({
      ...patient,
      nursingData
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao salvar balanço hídrico:", error);
    return false;
  }
};

// Salvar evolução de enfermagem para um paciente
export const saveNursingEvolution = async (patientId: string, evolution: NursingEvolutionData): Promise<boolean> => {
  try {
    // Sanitizar dados
    if (typeof evolution.evolution === 'string') {
      evolution.evolution = evolution.evolution.replace(/<[^>]*>?/gm, '');
    }
    
    // Buscar paciente atual
    const patient = await getPatientById(patientId);
    if (!patient) return false;
    
    // Atualizar dados de enfermagem
    const nursingData = patient.nursingData || {};
    
    // Adicionar evolução atual ao histórico
    const previousEvolutions = nursingData.evolution?.previousEvolutions || [];
    if (nursingData.evolution) {
      previousEvolutions.unshift({
        date: nursingData.evolution.date,
        time: nursingData.evolution.time,
        evolution: nursingData.evolution.evolution,
      });
    }
    
    nursingData.evolution = {
      ...evolution,
      previousEvolutions,
    };
    nursingData.lastUpdate = new Date().toISOString();
    
    // Salvar paciente atualizado
    await savePatient({
      ...patient,
      nursingData
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao salvar evolução de enfermagem:", error);
    return false;
  }
};

// Salvar procedimentos para um paciente
export const saveProcedures = async (patientId: string, procedures: ProcedureData): Promise<boolean> => {
  try {
    // Buscar paciente atual
    const patient = await getPatientById(patientId);
    if (!patient) return false;
    
    // Atualizar dados de enfermagem
    const nursingData = patient.nursingData || {};
    nursingData.procedures = procedures;
    nursingData.lastUpdate = new Date().toISOString();
    
    // Salvar paciente atualizado
    await savePatient({
      ...patient,
      nursingData
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao salvar procedimentos:", error);
    return false;
  }
};

// Salvar medicações para um paciente
export const saveMedications = async (patientId: string, medication: MedicationData): Promise<boolean> => {
  try {
    // Buscar paciente atual
    const patient = await getPatientById(patientId);
    if (!patient) return false;
    
    // Atualizar dados de enfermagem
    const nursingData = patient.nursingData || {};
    nursingData.medication = medication;
    nursingData.lastUpdate = new Date().toISOString();
    
    // Salvar paciente atualizado
    await savePatient({
      ...patient,
      nursingData
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao salvar medicações:", error);
    return false;
  }
};

// Completar avaliação de enfermagem
export const completeNursingAssessment = async (patientId: string, nurseData: {name: string}): Promise<boolean> => {
  try {
    // Buscar paciente atual
    const patient = await getPatientById(patientId);
    if (!patient) return false;
    
    // Atualizar dados de enfermagem
    const nursingData = patient.nursingData || {};
    nursingData.completedBy = nurseData.name;
    nursingData.lastUpdate = new Date().toISOString();
    
    // Atualizar status do paciente
    await savePatient({
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
export const getNursingAssessment = async (patientId: string): Promise<NursingAssessmentData | null> => {
  try {
    const patient = await getPatientById(patientId);
    if (!patient) return null;
    
    return patient.nursingData || {};
  } catch (error) {
    console.error("Erro ao obter dados de enfermagem:", error);
    return null;
  }
};

// Serviço genérico para salvar qualquer tipo de dado de enfermagem
export const saveNursingData = async (patientId: string, dataType: string, data: any): Promise<boolean> => {
  try {
    // Buscar paciente atual
    const patient = await getPatientById(patientId);
    if (!patient) return false;
    
    // Atualizar dados de enfermagem
    const nursingData = patient.nursingData || {};
    nursingData[dataType] = data;
    nursingData.lastUpdate = new Date().toISOString();
    
    // Salvar paciente atualizado
    await savePatient({
      ...patient,
      nursingData
    });
    
    return true;
  } catch (error) {
    console.error(`Erro ao salvar dados de enfermagem (${dataType}):`, error);
    return false;
  }
};
