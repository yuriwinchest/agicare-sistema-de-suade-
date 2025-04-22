import { supabase } from "@/integrations/supabase/client";
import { addToOfflineQueue, getOfflineQueue, markAsSynced } from "./offline/offlineSyncService";
import type { VitalSigns, NursingAssessment } from "./nursing/types";
import { getPatientById, savePatient } from './patientService';
import { Patient } from './patients/types';

// Interfaces for data typing
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

export const saveNursingData = async (patientId: string, dataType: string, data: any): Promise<boolean> => {
  try {
    // First try to save directly
    const { error } = await supabase
      .from('nursing_records')
      .upsert({
        patient_id: patientId,
        [dataType]: data,
        updated_at: new Date().toISOString()
      });

    if (error) {
      // If saving fails, add to offline queue
      await addToOfflineQueue({
        patient_id: patientId,
        data_type: dataType,
        data: data,
        timestamp: Date.now()
      });
    }

    return true;
  } catch (error) {
    console.error("Error saving nursing data:", error);
    return false;
  }
};

// Add or update a patient's vital signs
// export const saveNursingData = async (patientId: string, dataType: NursingDataType, data: any): Promise<boolean> => {
//   try {
//     // Get the current patient
//     const patient = await getPatientById(patientId) as Patient & { nursingData?: any };
    
//     if (!patient) {
//       console.error("Patient not found:", patientId);
//       return false;
//     }
    
//     // Initialize nursingData object if it doesn't exist
//     if (!patient.nursingData) {
//       patient.nursingData = {};
//     }
    
//     // Update the specific data type
//     patient.nursingData[dataType] = data;
    
//     // For evolution, maintain history of previous evolutions
//     if (dataType === 'evolution' && data.evolution) {
//       if (!patient.nursingData.evolution.previousEvolutions) {
//         patient.nursingData.evolution.previousEvolutions = [];
//       }
      
//       // Add current evolution to history
//       patient.nursingData.evolution.previousEvolutions = [
//         {
//           id: Date.now().toString(),
//           date: data.date,
//           time: data.time,
//           evolution: data.evolution
//         },
//         ...(patient.nursingData.evolution.previousEvolutions || [])
//       ];
//     }
    
//     // Save the updated patient
//     await savePatient(patient);
    
//     // Add to offline synchronization queue
//     await addToOfflineQueue(patientId, dataType, data);
    
//     return true;
//   } catch (error) {
//     console.error("Error saving nursing data:", error);
//     return false;
//   }
// };

// Gerenciamento de sincronização offline
const OFFLINE_SYNC_QUEUE_KEY = 'nursingOfflineSyncQueue';

// Adiciona um item à fila de sincronização offline
// const addToOfflineQueue = async (patientId: string, dataType: NursingDataType, data: any): Promise<void> => {
//   try {
//     const syncItem = {
//       patient_id: patientId,
//       data_type: dataType,
//       data: JSON.stringify(data),
//       timestamp: Date.now(),
//       synced: false
//     };
    
//     // Salvar no Supabase
//     const { error } = await supabase
//       .from('offline_sync_queue')
//       .insert(syncItem);
      
//     if (error) {
//       throw error;
//     }
    
//     // Backup no localStorage
//     const queue = getOfflineQueueFromLocalStorage();
//     queue.push({
//       patientId,
//       dataType,
//       data,
//       timestamp: Date.now(),
//       synced: false
//     });
    
//     localStorage.setItem(OFFLINE_SYNC_QUEUE_KEY, JSON.stringify(queue));
//   } catch (error) {
//     console.error("Error adding to offline synchronization queue:", error);
    
//     // Fallback para localStorage
//     const queue = getOfflineQueueFromLocalStorage();
//     queue.push({
//       patientId,
//       dataType,
//       data,
//       timestamp: Date.now(),
//       synced: false
//     });
    
//     localStorage.setItem(OFFLINE_SYNC_QUEUE_KEY, JSON.stringify(queue));
//   }
// };

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
// export const getOfflineQueue = async (): Promise<OfflineSyncItem[]> => {
//   try {
//     // Tentar buscar do Supabase
//     const { data, error } = await supabase
//       .from('offline_sync_queue')
//       .select('*')
//       .order('timestamp', { ascending: false });
      
//     if (error) {
//       throw error;
//     }
    
//     return data.map(item => ({
//       patientId: item.patient_id,
//       dataType: item.data_type as NursingDataType,
//       data: JSON.parse(item.data),
//       timestamp: item.timestamp,
//       synced: item.synced
//     }));
//   } catch (error) {
//     console.error("Error getting offline synchronization queue from Supabase:", error);
    
//     // Fallback para localStorage
//     return getOfflineQueueFromLocalStorage();
//   }
// };

// Sincroniza dados offline quando a conexão estiver disponível
export const syncOfflineData = async (): Promise<boolean> => {
  try {
    if (!navigator.onLine) return false;

    const queue = await getOfflineQueue();
    const unsyncedItems = queue.filter(item => !item.synced);

    for (const item of unsyncedItems) {
      try {
        await saveNursingData(item.patient_id, item.data_type, item.data);
        await markAsSynced(item.id!);
      } catch (error) {
        console.error("Error syncing item:", error);
      }
    }

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
