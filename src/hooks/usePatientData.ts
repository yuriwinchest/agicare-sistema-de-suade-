
import { useState, useEffect } from "react";
import { getPatientById } from "@/services/patientService";

export const usePatientData = (patientId: string | undefined) => {
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = () => {
      setLoading(true);
      
      if (!patientId) {
        setError("ID do paciente não fornecido");
        setLoading(false);
        return;
      }
      
      try {
        const patient = getPatientById(patientId);
        
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
  }, [patientId]);

  return { patientData, loading, error };
};
