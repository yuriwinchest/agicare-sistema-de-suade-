
import { useState, useEffect } from "react";
import { getAmbulatoryPatients } from "@/services/patientService";
import { useToast } from "@/hooks/use-toast";

export type AmbulatoryDataState = {
  waiting: any[];
  today: any[];
  return: any[];
  observation: any[];
};

export const useAmbulatoryData = () => {
  const [patientData, setPatientData] = useState<AmbulatoryDataState>({
    waiting: [],
    today: [],
    return: [],
    observation: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAmbulatoryPatients = async () => {
    try {
      setLoading(true);
      const ambulatoryPatients = await getAmbulatoryPatients();
      
      const waiting = ambulatoryPatients.filter(p => !p.status || p.status === "Aguardando");
      
      setPatientData({
        waiting,
        today: [
          ...waiting,
          { id: "005", name: "Antônio Silva", status: "Em Atendimento", time: "08:30" },
          { id: "006", name: "Fernanda Lima", status: "Finalizado", time: "08:00" },
        ],
        return: [
          { id: "007", name: "Paulo Oliveira", reason: "Retorno Ortopedia", time: "11:00" },
          { id: "008", name: "Camila Nunes", reason: "Retorno Cardiologia", time: "13:30" },
        ],
        observation: [
          { id: "009", name: "Luciana Martins", reason: "Monitoramento pressão", time: "08:45", duration: "2h" },
          { id: "010", name: "Rafael Gomes", reason: "Medicação IV", time: "09:00", duration: "1h" },
        ]
      });
      setError(null);
    } catch (err) {
      const errorMessage = "Erro ao buscar pacientes ambulatoriais";
      console.error(errorMessage, err);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erro",
        description: errorMessage
      });
      setPatientData({
        waiting: [],
        today: [],
        return: [],
        observation: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbulatoryPatients();
  }, []);

  return { patientData, loading, error, refetch: fetchAmbulatoryPatients };
};
