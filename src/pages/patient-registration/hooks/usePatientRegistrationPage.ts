
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
      console.log("Starting save process with data:", formData);
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        throw new Error("Sessão de autenticação perdida. Faça login novamente.");
      }

      // Prepare basic patient data with additional fields included
      const { 
        appointmentTime, 
        ...patientData 
      } = formData;

      // Include appointmentTime directly in the patient record
      const patientToSave = {
        ...patientData,
        appointment_time: appointmentTime || null
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
        throw patientError;
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
