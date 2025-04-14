
import { supabase, Patient } from './supabaseClient';

// Função para iniciar a migração de dados do localStorage para o Supabase, se necessário
const migrateLocalDataIfNeeded = async () => {
  try {
    // Verifica se já existe uma flag indicando que a migração foi feita
    const migrationDone = localStorage.getItem('supabaseMigrationDone');
    
    if (migrationDone === 'true') {
      return; // Migração já foi realizada
    }

    // Obtém pacientes do localStorage
    const storedPatients = localStorage.getItem('patients');
    if (storedPatients) {
      const patients = JSON.parse(storedPatients);
      
      // Insere cada paciente no Supabase
      for (const patient of patients) {
        await supabase.from('patients').upsert({
          id: patient.id,
          name: patient.name,
          cpf: patient.cpf,
          phone: patient.phone,
          date: patient.date,
          time: patient.time,
          status: patient.status,
          reception: patient.reception,
          specialty: patient.specialty,
          professional: patient.professional,
          observations: patient.observations,
          redirected: patient.redirected,
          redirection_time: patient.redirectionTime,
          // Converte o objeto nursingData para JSON se existir
          nursing_data: patient.nursingData ? JSON.stringify(patient.nursingData) : null
        }, { onConflict: 'id' });
      }
      
      // Marca migração como concluída
      localStorage.setItem('supabaseMigrationDone', 'true');
      console.log('Migração de pacientes do localStorage para Supabase concluída');
    }
  } catch (error) {
    console.error('Erro ao migrar dados:', error);
  }
};

// Iniciar migração quando o serviço é carregado
migrateLocalDataIfNeeded();

// Get all patients - now properly async
export const getPatients = async (): Promise<Patient[]> => {
  try {
    // Primeiro tenta buscar do Supabase
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data.map(patient => ({
      ...patient,
      nursingData: patient.nursing_data ? JSON.parse(patient.nursing_data) : {},
      // Converte campos para o formato esperado pelo frontend
      redirectionTime: patient.redirection_time,
      // Garante que sempre exista um array de alergias
      allergies: patient.allergies || []
    }));
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    
    // Fallback para localStorage em caso de erro
    const storedPatients = localStorage.getItem('patients');
    if (storedPatients) {
      return JSON.parse(storedPatients).map((patient: any) => ({
        ...patient,
        allergies: patient.allergies || []
      }));
    }
    
    return [];
  }
};

// Get active appointments - versão assíncrona
export const getActiveAppointmentsAsync = async () => {
  try {
    // Busca pacientes ativos do Supabase
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or('status.neq.Atendido,status.neq.Medicação,status.neq.Observação,status.neq.Alta,status.neq.Internação')
      .eq('redirected', false)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(patient => ({
      ...patient,
      nursingData: patient.nursing_data ? JSON.parse(patient.nursing_data) : {},
      redirectionTime: patient.redirection_time,
      allergies: patient.allergies || []
    }));
  } catch (error) {
    console.error("Erro ao buscar consultas ativas:", error);
    return getActiveAppointments(); // Fallback para versão síncrona
  }
};

// Get active appointments - versão síncrona para compatibilidade
export const getActiveAppointments = () => {
  const storedPatients = localStorage.getItem('patients');
  if (storedPatients) {
    return JSON.parse(storedPatients)
      .filter((patient: any) => 
        patient.status !== "Atendido" && 
        patient.status !== "Medicação" && 
        patient.status !== "Observação" &&
        patient.status !== "Alta" &&
        patient.status !== "Internação" &&
        !patient.redirected
      )
      .map((patient: any) => ({
        ...patient,
        allergies: patient.allergies || []
      }));
  }
  
  return [];
};

// Get patient by ID - now properly async
export const getPatientById = async (id: string): Promise<Patient | null> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      ...data,
      nursingData: data.nursing_data ? JSON.parse(data.nursing_data) : {},
      redirectionTime: data.redirection_time,
      allergies: data.allergies || []
    };
  } catch (error) {
    console.error("Erro ao buscar paciente:", error);
    
    // Fallback para localStorage
    const storedPatients = localStorage.getItem('patients');
    if (storedPatients) {
      const patient = JSON.parse(storedPatients).find((p: any) => p.id === id);
      if (patient) {
        return {
          ...patient,
          allergies: patient.allergies || []
        };
      }
    }
    
    return null;
  }
};

// Get patient by ID async version
export const getPatientByIdAsync = async (id: string): Promise<Patient | null> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      ...data,
      nursingData: data.nursing_data ? JSON.parse(data.nursing_data) : {},
      redirectionTime: data.redirection_time,
      allergies: data.allergies || []
    };
  } catch (error) {
    console.error("Erro ao buscar paciente:", error);
    
    // Fallback para localStorage
    return getPatientById(id);
  }
};

// Generate a unique ID
const generateUniqueId = async (): Promise<string> => {
  try {
    // Tenta obter o maior ID do Supabase
    const { data, error } = await supabase
      .from('patients')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);
      
    if (error) {
      throw error;
    }
    
    if (data && data.length > 0) {
      const highestId = parseInt(data[0].id);
      return (highestId + 1).toString().padStart(3, '0');
    }
    
    return "001"; // Primeiro ID se não houver pacientes
  } catch (error) {
    console.error("Erro ao gerar ID único:", error);
    
    // Fallback para geração local
    const storedPatients = localStorage.getItem('patients');
    if (storedPatients) {
      const patients = JSON.parse(storedPatients);
      if (patients.length === 0) {
        return "001";
      }
      const highestId = Math.max(...patients.map((p: any) => parseInt(p.id)));
      return (highestId + 1).toString().padStart(3, '0');
    }
    
    return "001";
  }
};

// Save new patient or update existing one
export const savePatient = async (patient: any): Promise<Patient> => {
  try {
    let patientToSave = { ...patient };
    
    // Se não houver ID, gerar um novo
    if (!patientToSave.id) {
      patientToSave.id = await generateUniqueId();
      
      // Adicionar campos de recepção e data para novos pacientes
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const date = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
      
      patientToSave = {
        ...patientToSave,
        reception: patientToSave.reception || "RECEPÇÃO CENTRAL",
        date,
        time,
        status: patientToSave.status || "Agendado",
        created_at: now.toISOString()
      };
    }

    // Backup no localStorage e persistência assíncrona no Supabase
    const savedPatient = saveToLocalStorage(patientToSave);
    
    // Atualizar no Supabase
    await savePatientToSupabase(savedPatient);
    
    return savedPatient;
  } catch (error) {
    console.error("Erro ao salvar paciente:", error);
    
    // Fallback para localStorage
    return saveToLocalStorage(patient);
  }
};

// Função para salvar o paciente no Supabase de forma assíncrona
const savePatientToSupabase = async (patient: Patient) => {
  try {
    // Preparar dados para Supabase (adaptar campos)
    const supabasePatient = {
      id: patient.id,
      name: patient.name,
      cpf: patient.cpf,
      phone: patient.phone,
      date: patient.date,
      time: patient.time,
      status: patient.status,
      reception: patient.reception,
      specialty: patient.specialty,
      professional: patient.professional,
      observations: patient.observations,
      redirected: patient.redirected || false,
      redirection_time: patient.redirectionTime,
      allergies: patient.allergies || [],
      nursing_data: patient.nursingData ? JSON.stringify(patient.nursingData) : null
    };
    
    const { data, error } = await supabase
      .from('patients')
      .upsert(supabasePatient, { onConflict: 'id' })
      .select();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao salvar paciente no Supabase:", error);
    throw error;
  }
};

// Função auxiliar para salvar no localStorage (como fallback)
const saveToLocalStorage = (patient: any): Patient => {
  try {
    const storedPatients = localStorage.getItem('patients');
    let patients: any[] = storedPatients ? JSON.parse(storedPatients) : [];
    
    const existingPatientIndex = patients.findIndex(p => p.id === patient.id);
    
    if (existingPatientIndex >= 0) {
      // Atualizar paciente existente
      patients[existingPatientIndex] = { ...patients[existingPatientIndex], ...patient };
    } else {
      // Gerar um novo ID se necessário
      if (!patient.id) {
        if (patients.length === 0) {
          patient.id = "001";
        } else {
          const highestId = Math.max(...patients.map(p => parseInt(p.id)));
          patient.id = (highestId + 1).toString().padStart(3, '0');
        }
        
        // Adicionar campos de recepção e data para novos pacientes
        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const date = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
        
        patient = {
          ...patient,
          reception: "RECEPÇÃO CENTRAL",
          date,
          time,
          status: patient.status || "Agendado"
        };
      }
      
      // Adicionar novo paciente
      patients.unshift(patient);
    }
    
    localStorage.setItem('patients', JSON.stringify(patients));
    return patient;
  } catch (error) {
    console.error("Erro ao salvar paciente no localStorage:", error);
    return patient;
  }
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
export const confirmPatientAppointment = async (patientId: string, appointmentData: any) => {
  try {
    // Buscar paciente
    const patient = await getPatientById(patientId);
    
    if (!patient) {
      console.error("Paciente não encontrado:", patientId);
      return null;
    }
    
    // Atualizar dados do paciente com os dados do agendamento
    const updatedPatient = {
      ...patient,
      ...appointmentData,
      status: "Aguardando"
    };
    
    // Salvar paciente atualizado
    const savedPatient = await savePatient(updatedPatient);
    
    if (!savedPatient) {
      console.error("Falha ao salvar paciente:", patientId);
      return null;
    }
    
    // Atualizar lista ambulatorial (simulando relação com o banco de dados)
    await updateAmbulatoryPatient(savedPatient);
    
    return savedPatient;
  } catch (error) {
    console.error("Erro ao confirmar agendamento:", error);
    return null;
  }
};

// Get all ambulatory patients
export const getAmbulatoryPatients = async () => {
  try {
    // Buscar pacientes ambulatoriais do Supabase
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or('status.eq.Aguardando,status.eq.Medicação,status.eq.Observação')
      .order('time', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    // Converter para o formato esperado pela UI
    return data.map(patient => ({
      id: patient.id,
      name: patient.name,
      priority: patient.priority || "Normal",
      time: patient.time,
      specialty: patient.specialty,
      professional: patient.professional,
      triage: patient.nursing_data ? 
        JSON.parse(patient.nursing_data).vitalSigns || { 
          temp: "36.5°C", 
          pressure: "120/80", 
          symptoms: patient.observations || "Sem sintomas relatados" 
        } 
        : { 
          temp: "36.5°C", 
          pressure: "120/80", 
          symptoms: patient.observations || "Sem sintomas relatados" 
        }
    }));
  } catch (error) {
    console.error("Erro ao buscar pacientes ambulatoriais:", error);
    
    // Fallback para localStorage
    const storedPatients = localStorage.getItem('ambulatoryPatients');
    if (storedPatients) {
      return JSON.parse(storedPatients);
    }
    
    return [];
  }
};

// Update or add patient to ambulatory
export const updateAmbulatoryPatient = async (patient: any) => {
  try {
    // Converter paciente da recepção para o formato ambulatorial
    const ambulatoryPatient = {
      id: patient.id,
      name: patient.name,
      priority: patient.priority || "Normal",
      time: patient.time,
      specialty: patient.specialty,
      professional: patient.professional,
      triage: { 
        temp: "36.5°C", 
        pressure: "120/80", 
        symptoms: patient.observations || "Sem sintomas relatados" 
      }
    };
    
    // Salvar no localStorage como fallback
    let ambulatoryPatients = [];
    const storedPatients = localStorage.getItem('ambulatoryPatients');
    
    if (storedPatients) {
      ambulatoryPatients = JSON.parse(storedPatients);
      const existingIndex = ambulatoryPatients.findIndex((p: any) => p.id === patient.id);
      
      if (existingIndex >= 0) {
        ambulatoryPatients[existingIndex] = ambulatoryPatient;
      } else {
        ambulatoryPatients.unshift(ambulatoryPatient);
      }
    } else {
      ambulatoryPatients = [ambulatoryPatient];
    }
    
    localStorage.setItem('ambulatoryPatients', JSON.stringify(ambulatoryPatients));
    
    return patient;
  } catch (error) {
    console.error("Erro ao atualizar paciente ambulatorial:", error);
    return patient;
  }
};

// Update patient status when redirected from doctor
export const updatePatientRedirection = async (patientId: string, destination: string) => {
  try {
    // Buscar paciente
    const patient = await getPatientById(patientId);
    
    if (!patient) {
      console.error("Paciente não encontrado:", patientId);
      return null;
    }
    
    // Atualizar status do paciente para o destino
    const updatedPatient = {
      ...patient,
      status: destination,
      redirected: true,
      redirectionTime: new Date().toISOString()
    };
    
    // Salvar paciente atualizado
    const savedPatient = await savePatient(updatedPatient);
    
    return savedPatient;
  } catch (error) {
    console.error("Erro ao atualizar redirecionamento do paciente:", error);
    return null;
  }
};

// Buscar profissionais de saúde
export const getHealthProfessionals = async () => {
  try {
    const { data, error } = await supabase
      .from('health_professionals')
      .select('*')
      .eq('active', true)
      .order('name', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar profissionais de saúde:", error);
    
    // Dados de fallback
    return [
      { id: '1', name: 'Dr. João Silva', specialty: 'Clínico Geral', license_number: 'CRM 12345' },
      { id: '2', name: 'Dra. Maria Oliveira', specialty: 'Pediatria', license_number: 'CRM 23456' },
      { id: '3', name: 'Dr. Carlos Santos', specialty: 'Ortopedia', license_number: 'CRM 34567' }
    ];
  }
};

// Buscar agenda de um profissional
export const getProfessionalSchedule = async (professionalId: string) => {
  try {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('professional_id', professionalId)
      .order('day_of_week', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar agenda do profissional:", error);
    return [];
  }
};

// Buscar agendamentos para um dia específico
export const getAppointmentsForDate = async (date: string) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients:patient_id (name, phone)
      `)
      .eq('date', date)
      .order('time', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar agendamentos para a data:", error);
    return [];
  }
};
