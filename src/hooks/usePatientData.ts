
import { useState, useEffect } from "react";
import { getPatientById } from "@/services/patientService";
import { supabase } from "@/integrations/supabase/client";

export const usePatientData = (patientId: string | undefined) => {
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      
      if (!patientId) {
        setError("ID do paciente não fornecido");
        setLoading(false);
        return;
      }
      
      try {
        console.log(`Buscando dados do paciente com ID: ${patientId}`);
        const patient = await getPatientById(patientId);
        
        if (patient) {
          console.log("Dados do paciente encontrados:", patient);
          setPatientData(patient);
          setError(null);
        } else {
          console.log("Paciente não encontrado");
          setError("Paciente não encontrado");
        }
      } catch (err) {
        console.error("Erro ao buscar paciente:", err);
        setError("Erro ao carregar dados do paciente");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
    
    // Configurar assinatura para atualizações em tempo real
    let subscription;
    
    try {
      subscription = supabase
        .channel(`patient-${patientId}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'patients',
          filter: `id=eq.${patientId}`
        }, 
        (payload) => {
          console.log("Dados do paciente atualizados:", payload);
          console.log("Buscando novos dados...");
          fetchPatientData();
        })
        .subscribe();
    } catch (subscriptionError) {
      console.error("Erro ao configurar assinatura em tempo real:", subscriptionError);
    }
      
    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error("Erro ao cancelar assinatura:", error);
        }
      }
    };
  }, [patientId]);

  return { patientData, loading, error };
};
