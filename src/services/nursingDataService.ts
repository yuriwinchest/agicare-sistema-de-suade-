
import { supabase } from './supabaseClient';
import { getPatientById, savePatient } from './patientService';

// Interfaces para tipagem dos dados
export interface VitalSigns {
  temperature: string;
  pressure: string;
  pulse: string;
  respiratory: string;
  oxygen: string;
  painScale?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  date?: string;
  time?: string;
}

export interface EvolutionEntry {
  id: string;
  date: string;
  time: string;
  evolution: string;
}

export interface NursingEvolution {
  date?: string;
  time?: string;
  evolution?: string;
  previousEvolutions?: EvolutionEntry[];
}

export interface HydricBalance {
  date?: string;
  intakeRecords?: Array<{id: string, type: string, volume: string, time: string}>;
  outputRecords?: Array<{id: string, type: string, volume: string, time: string}>;
  totalIntake?: string;
  totalOutput?: string;
  balance?: string;
}

export interface ProcedureRecord {
  id: string;
  date: string;
  time: string;
  procedure: string;
  notes?: string;
  status: 'planejado' | 'realizado' | 'cancelado';
}

export interface MedicationCheck {
  medications?: Array<{
    id: string;
    name: string;
    dosage: string;
    route: string;
    time: string;
    status: 'pendente' | 'administrado' | 'cancelado';
    administeredBy?: string;
    administeredAt?: string;
    notes?: string;
  }>;
}

// Define accepted data types as a union of string literals
export type NursingDataType = 'vitalSigns' | 'anamnesis' | 'evolution' | 'hydricBalance' | 'procedures' | 'medication' | 'physicalExam';

export interface OfflineSyncItem {
  patientId: string;
  dataType: NursingDataType;
  data: any;
  timestamp: number;
  synced: boolean;
}

// Adiciona ou atualiza os sinais vitais de um paciente
export const saveNursingData = async (patientId: string, dataType: NursingDataType, data: any): Promise<boolean> => {
  try {
    // Busca o paciente atual
    const patient = await getPatientById(patientId);
    
    if (!patient) {
      console.error("Paciente não encontrado:", patientId);
      return false;
    }
    
    // Inicializa objeto nursingData se não existir
    if (!patient.nursingData) {
      patient.nursingData = {};
    }
    
    // Atualiza o tipo de dado específico
    patient.nursingData[dataType] = data;
    
    // Para evolução, mantém o histórico de evoluções anteriores
    if (dataType === 'evolution' && data.evolution) {
      if (!patient.nursingData.evolution.previousEvolutions) {
        patient.nursingData.evolution.previousEvolutions = [];
      }
      
      // Adiciona evolução atual ao histórico
      patient.nursingData.evolution.previousEvolutions = [
        {
          id: Date.now().toString(),
          date: data.date,
          time: data.time,
          evolution: data.evolution
        },
        ...(patient.nursingData.evolution.previousEvolutions || [])
      ];
    }
    
    // Salva o paciente atualizado
    await savePatient(patient);
    
    // Adiciona à fila de sincronização offline
    await addToOfflineQueue(patientId, dataType, data);
    
    return true;
  } catch (error) {
    console.error("Erro ao salvar dados de enfermagem:", error);
    return false;
  }
};

// Gerenciamento de sincronização offline
const OFFLINE_SYNC_QUEUE_KEY = 'nursingOfflineSyncQueue';

// Adiciona um item à fila de sincronização offline
const addToOfflineQueue = async (patientId: string, dataType: NursingDataType, data: any): Promise<void> => {
  try {
    const syncItem = {
      patient_id: patientId,
      data_type: dataType,
      data: JSON.stringify(data),
      timestamp: Date.now(),
      synced: false
    };
    
    // Salvar no Supabase
    const { error } = await supabase
      .from('offline_sync_queue')
      .insert(syncItem);
      
    if (error) {
      throw error;
    }
    
    // Backup no localStorage
    const queue = getOfflineQueueFromLocalStorage();
    queue.push({
      patientId,
      dataType,
      data,
      timestamp: Date.now(),
      synced: false
    });
    
    localStorage.setItem(OFFLINE_SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error("Erro ao adicionar à fila de sincronização offline:", error);
    
    // Fallback para localStorage
    const queue = getOfflineQueueFromLocalStorage();
    queue.push({
      patientId,
      dataType,
      data,
      timestamp: Date.now(),
      synced: false
    });
    
    localStorage.setItem(OFFLINE_SYNC_QUEUE_KEY, JSON.stringify(queue));
  }
};

// Obtém a fila de sincronização offline do localStorage (fallback)
const getOfflineQueueFromLocalStorage = (): OfflineSyncItem[] => {
  try {
    const queue = localStorage.getItem(OFFLINE_SYNC_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (error) {
    console.error("Erro ao obter fila de sincronização offline do localStorage:", error);
    return [];
  }
};

// Obtém a fila de sincronização offline
export const getOfflineQueue = async (): Promise<OfflineSyncItem[]> => {
  try {
    // Tentar buscar do Supabase
    const { data, error } = await supabase
      .from('offline_sync_queue')
      .select('*')
      .order('timestamp', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data.map(item => ({
      patientId: item.patient_id,
      dataType: item.data_type as NursingDataType,
      data: JSON.parse(item.data),
      timestamp: item.timestamp,
      synced: item.synced
    }));
  } catch (error) {
    console.error("Erro ao obter fila de sincronização offline do Supabase:", error);
    
    // Fallback para localStorage
    return getOfflineQueueFromLocalStorage();
  }
};

// Sincroniza dados offline quando a conexão estiver disponível
export const syncOfflineData = async (): Promise<boolean> => {
  try {
    // Verifica se está online
    if (!navigator.onLine) {
      return false;
    }
    
    const queue = await getOfflineQueue();
    const unsyncedItems = queue.filter(item => !item.synced);
    
    if (unsyncedItems.length === 0) {
      return true;
    }
    
    // Em uma implementação real com Supabase, aqui seria a sincronização com o servidor
    for (const item of unsyncedItems) {
      console.log(`Sincronizando dados de ${item.dataType} para paciente ${item.patientId}`);
      
      // Atualizar o status no Supabase
      const { error } = await supabase
        .from('offline_sync_queue')
        .update({ synced: true })
        .eq('patient_id', item.patientId)
        .eq('data_type', item.dataType)
        .eq('timestamp', item.timestamp);
        
      if (error) {
        console.error("Erro ao atualizar status de sincronização:", error);
      }
    }
    
    // Atualizar o localStorage como backup
    const localQueue = getOfflineQueueFromLocalStorage();
    for (const item of localQueue) {
      if (!item.synced) {
        item.synced = true;
      }
    }
    localStorage.setItem(OFFLINE_SYNC_QUEUE_KEY, JSON.stringify(localQueue));
    
    return true;
  } catch (error) {
    console.error("Erro durante sincronização offline:", error);
    return false;
  }
};

// Função para configurar ouvintes de eventos de conectividade
export const setupOfflineSyncListeners = (): void => {
  // Tenta sincronizar quando a conexão for restaurada
  window.addEventListener('online', () => {
    console.log("Conexão restaurada. Iniciando sincronização...");
    syncOfflineData();
  });
  
  // Registra quando ficar offline
  window.addEventListener('offline', () => {
    console.log("Dispositivo offline. Os dados serão sincronizados quando a conexão for restaurada.");
  });
};

// Inicializa os ouvintes quando o serviço for carregado
if (typeof window !== 'undefined') {
  setupOfflineSyncListeners();
}
