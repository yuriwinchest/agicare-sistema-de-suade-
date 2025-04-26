
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
      
      // Prepare data for saving
      const finalData = {
        ...formData,
        status: "Agendado",
        reception: formData.reception || "RECEPÇÃO CENTRAL",
        specialty: formData.specialty || null,
        professional: formData.professional || null,
        health_plan: formData.healthPlan || null,
        birth_date: formData.birth_date || null,
        appointmentTime: formData.appointmentTime || null,
        address: formData.addressDetails && Object.keys(formData.addressDetails).length > 0 
          ? JSON.stringify(formData.addressDetails) 
          : null
      };

      // Check session again just before the insert operation
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        throw new Error("Sessão de autenticação perdida. Faça login novamente.");
      }
      
      // Insert into Supabase
      const { data: savedPatient, error } = await supabase
        .from('patients')
        .insert(finalData)
        .select()
        .single();
      
      if (error) {
        throw error;
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
