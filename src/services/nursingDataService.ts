import { supabase } from './supabaseClient';
import { getPatientById, savePatient } from './patientService';
import { Patient } from './patients/types';

// Interfaces for data typing
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

// Add or update a patient's vital signs
export const saveNursingData = async (patientId: string, dataType: NursingDataType, data: any): Promise<boolean> => {
  try {
    // Get the current patient
    const patient = await getPatientById(patientId) as Patient & { nursingData?: any };
    
    if (!patient) {
      console.error("Patient not found:", patientId);
      return false;
    }
    
    // Initialize nursingData object if it doesn't exist
    if (!patient.nursingData) {
      patient.nursingData = {};
    }
    
    // Update the specific data type
    patient.nursingData[dataType] = data;
    
    // For evolution, maintain history of previous evolutions
    if (dataType === 'evolution' && data.evolution) {
      if (!patient.nursingData.evolution.previousEvolutions) {
        patient.nursingData.evolution.previousEvolutions = [];
      }
      
      // Add current evolution to history
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
    
    // Save the updated patient
    await savePatient(patient);
    
    // Add to offline synchronization queue
    await addToOfflineQueue(patientId, dataType, data);
    
    return true;
  } catch (error) {
    console.error("Error saving nursing data:", error);
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
    console.error("Error adding to offline synchronization queue:", error);
    
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
    console.error("Error getting offline synchronization queue from localStorage:", error);
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
    console.error("Error getting offline synchronization queue from Supabase:", error);
    
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
        console.error("Error updating synchronization status:", error);
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
    console.error("Error during offline synchronization:", error);
    return false;
  }
};

// Função para configurar ouvintes de eventos de conectividade
export const setupOfflineSyncListeners = (): void => {
  // Tenta sincronizar quando a conexão for restaurada
  window.addEventListener('online', () => {
    console.log("Connection restored. Starting synchronization...");
    syncOfflineData();
  });
  
  // Registra quando ficar offline
  window.addEventListener('offline', () => {
    console.log("Device offline. The data will be synchronized when the connection is restored.");
  });
};

// Inicializa os ouvintes quando o serviço for carregado
if (typeof window !== 'undefined') {
  setupOfflineSyncListeners();
}
