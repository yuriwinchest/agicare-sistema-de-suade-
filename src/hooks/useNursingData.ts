
import { useState, useEffect } from 'react';
import { useNotification } from './useNotification';
import { saveNursingData, syncOfflineData } from '@/services/nursingDataService';
import { supabase } from '@/services/supabaseClient';

export const useNursingData = (patientId: string) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const { success, error } = useNotification();

  // Função para salvar sinais vitais
  const saveVitalSigns = async (data: any) => {
    const result = await saveNursingData(patientId, 'vitalSigns', data);
    return result;
  };

  // Função para salvar anamnese
  const saveAnamnesis = async (data: any) => {
    const result = await saveNursingData(patientId, 'anamnesis', data);
    return result;
  };

  // Função para salvar exame físico
  const savePhysicalExam = async (data: any) => {
    const result = await saveNursingData(patientId, 'physicalExam', data);
    return result;
  };

  // Função para salvar balanço hídrico
  const saveHydricBalance = async (data: any) => {
    const result = await saveNursingData(patientId, 'hydricBalance', data);
    return result;
  };

  // Função para salvar evolução
  const saveNursingEvolution = async (data: any) => {
    const result = await saveNursingData(patientId, 'evolution', {
      date: data.date,
      time: data.time,
      evolution: data.evolution,
    });
    return result;
  };

  // Função para salvar procedimentos
  const saveProcedures = async (data: any) => {
    const result = await saveNursingData(patientId, 'procedures', data);
    return result;
  };

  // Função para salvar medicações
  const saveMedications = async (data: any) => {
    const result = await saveNursingData(patientId, 'medication', data);
    return result;
  };

  // Função para forçar a sincronização dos dados offline
  const syncData = async () => {
    setIsSyncing(true);
    
    try {
      const result = await syncOfflineData();
      
      if (result) {
        setLastSyncTime(new Date());
        success("Sincronização concluída", {
          description: "Todos os dados foram sincronizados com sucesso."
        });
      } else {
        error("Falha na sincronização", {
          description: "Não foi possível sincronizar os dados. Verifique sua conexão."
        });
      }
    } catch (err) {
      console.error("Erro ao sincronizar dados:", err);
      error("Erro de sincronização", {
        description: "Ocorreu um erro durante a sincronização dos dados."
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Configurar subscription para atualizações em tempo real
  useEffect(() => {
    // Inscrever-se para atualizações em tempo real do paciente
    const subscription = supabase
      .channel(`patient-${patientId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'patients',
        filter: `id=eq.${patientId}`
      }, 
      () => {
        success("Dados atualizados", {
          description: "Os dados do paciente foram atualizados no servidor"
        });
      })
      .subscribe();
    
    // Detecta mudanças na conectividade e tenta sincronizar
    const handleOnline = () => {
      success("Conexão restaurada", {
        description: "Iniciando sincronização automática..."
      });
      syncData();
    };
    
    window.addEventListener('online', handleOnline);
    
    // Limpa as inscrições quando o componente é desmontado
    return () => {
      window.removeEventListener('online', handleOnline);
      subscription.unsubscribe();
    };
  }, [patientId]);

  return {
    saveVitalSigns,
    saveAnamnesis,
    savePhysicalExam,
    saveHydricBalance,
    saveNursingEvolution,
    saveProcedures,
    saveMedications,
    syncData,
    isSyncing,
    lastSyncTime,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
  };
};

export default useNursingData;
