import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase, isAuthenticated } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthContext";

export const usePatientRegistrationPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated: authContextAuthenticated } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authConfirmed, setAuthConfirmed] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = await isAuthenticated();
      setAuthConfirmed(authenticated);
      
      if (!authenticated) {
        toast({
          title: "Acesso Negado",
          description: "Você precisa estar logado para registrar pacientes.",
          variant: "destructive",
        });
        navigate("/login");
      }
    };
    
    checkAuthentication();
  }, [navigate, toast]);

  // Função para converter data do formato brasileiro para ISO
  const formatDateForDB = (dateStr: string): string => {
    if (!dateStr) return "";
    
    // Verifica se a data já está no formato ISO (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    // Converte de DD/MM/YYYY para YYYY-MM-DD
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      if (day && month && year) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    
    return "";
  };

  const handleComplete = async (formData: any) => {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      toast({
        title: "Erro ao salvar",
        description: "Você precisa estar logado para registrar pacientes.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Starting save process with data:", formData);
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        throw new Error("Sessão de autenticação perdida. Faça login novamente.");
      }

      // Formata a data de nascimento para o formato aceito pelo banco de dados
      const formattedBirthDate = formatDateForDB(formData.birth_date);
      
      if (formData.birth_date && !formattedBirthDate) {
        throw new Error(`Data de nascimento '${formData.birth_date}' está em formato inválido. Use DD/MM/YYYY.`);
      }

      // Preparar os dados do paciente para o banco de dados
      const patientToSave = {
        id: formData.id,
        name: formData.name,
        gender: formData.gender,
        birth_date: formattedBirthDate, // Aqui usamos a data formatada
        cpf: formData.cpf,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        nationality: formData.nationality,
        place_of_birth: formData.place_of_birth,
        place_of_birth_state: formData.place_of_birth_state,
        education_level: formData.education_level,
        occupation: formData.occupation,
        
        // Detalhes de alergias e documentos
        allergies: JSON.stringify(formData.allergies || []),
        documents: JSON.stringify(formData.documents || []),
        
        // Detalhes do atendimento
        attendance_type: formData.attendance_type,
        specialty: formData.specialty,
        professional: formData.professional,
        health_plan: formData.health_plan,
        health_card_number: formData.health_card_number,
        appointment_time: formData.appointment_time,
        
        // Campo de criação
        created_at: new Date().toISOString(),
      };
      
      console.log("Saving patient data:", patientToSave);

      // Save all patient data in a single operation to the patients table
      const { data: savedPatient, error: patientError } = await supabase
        .from('patients')
        .insert(patientToSave)
        .select()
        .single();
      
      if (patientError) {
        console.error("Error saving patient:", patientError);
        throw new Error(`Erro ao salvar paciente: ${patientError.message || patientError.details || JSON.stringify(patientError)}`);
      }
      
      console.log("Patient saved successfully:", savedPatient);
      
      toast({
        title: "Cadastro Salvo",
        description: "Os dados do paciente foram salvos com sucesso.",
        variant: "success"
      });
      
      setTimeout(() => {
        navigate("/reception");
      }, 1500);
    } catch (error: any) {
      console.error("Error saving patient:", error);
      console.error("Error details:", error.message);
      
      if (error.code === "23505") {
        toast({
          title: "Erro ao salvar",
          description: "Este paciente já existe no sistema. Verifique o CPF informado.",
          variant: "destructive"
        });
      } else if (error.code === "22008") {
        toast({
          title: "Erro ao salvar",
          description: "Formato de data inválido. Use o formato DD/MM/YYYY para a data de nascimento.",
          variant: "destructive"
        });
      } else if (error.code) {
        toast({
          title: "Erro ao salvar",
          description: `Código: ${error.code} - ${error.message || "Ocorreu um erro ao processar a requisição."}`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: error.message || "Ocorreu um erro ao processar a requisição.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => navigate(-1);

  return {
    isDialogOpen,
    isSubmitting,
    authConfirmed,
    handleComplete,
    handleGoBack
  };
};
