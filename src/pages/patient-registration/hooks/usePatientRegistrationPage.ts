
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
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        throw new Error("Sessão de autenticação perdida. Faça login novamente.");
      }

      // First save the basic patient data
      const { data: savedPatient, error: patientError } = await supabase
        .from('patients')
        .insert({
          id: formData.id,
          name: formData.name,
          cpf: formData.cpf,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          birth_date: formData.birth_date,
          status: formData.status,
          person_type: formData.person_type,
          gender: formData.gender,
          mother_name: formData.mother_name,
          father_name: formData.father_name,
          marital_status: formData.marital_status,
          attendance_type: formData.attendance_type
        })
        .select()
        .single();
      
      if (patientError) {
        throw patientError;
      }

      // Then save the additional data
      if (formData.additionalData) {
        const { error: additionalDataError } = await supabase
          .from('patient_additional_data')
          .insert(formData.additionalData);

        if (additionalDataError) {
          console.error("Error saving additional data:", additionalDataError);
          throw new Error("Erro ao salvar dados adicionais do paciente");
        }
      }
      
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
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao processar a requisição.",
        variant: "destructive"
      });
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
