
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
        const patient = await getPatientById(patientId);
        
        if (patient) {
          setPatientData(patient);
          setError(null);
        } else {
          setError("Paciente não encontrado");
        }
      } catch (err) {
        setError("Erro ao carregar dados do paciente");
        console.error("Erro ao buscar paciente:", err);
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
        () => {
          console.log("Dados do paciente atualizados, buscando novos dados...");
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
