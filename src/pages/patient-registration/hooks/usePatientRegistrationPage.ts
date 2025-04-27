
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

      // Extract basic patient data, additionalData, allergies, and documents
      const { additionalData, allergies = [], appointmentTime, documents = [], ...basicPatientData } = formData;
      
      console.log("Saving basic patient data:", basicPatientData);

      // First save the basic patient data
      const { data: savedPatient, error: patientError } = await supabase
        .from('patients')
        .insert(basicPatientData)
        .select()
        .single();
      
      if (patientError) {
        console.error("Error saving patient:", patientError);
        throw patientError;
      }
      
      console.log("Patient saved successfully:", savedPatient);

      // Prepare the additional data with appointmentTime included
      const patientAdditionalData = {
        ...(additionalData || {}),
        id: savedPatient.id,
        appointmentTime: appointmentTime || null
      };
      
      // Then save the additional data
      if (patientAdditionalData) {
        console.log("Saving additional data:", patientAdditionalData);
        
        const { error: additionalDataError } = await supabase
          .from('patient_additional_data')
          .insert(patientAdditionalData);

        if (additionalDataError) {
          console.error("Error saving additional data:", additionalDataError);
          throw new Error("Erro ao salvar dados adicionais do paciente: " + additionalDataError.message);
        }
        
        console.log("Additional data saved successfully");
      }
      
      // Save allergies separately to the patient_allergies table
      if (allergies && allergies.length > 0) {
        console.log("Saving patient allergies:", allergies);
        
        // Map allergies to include patient_id
        const allergiesWithPatientId = allergies.map((allergy: any) => ({
          ...allergy,
          patient_id: savedPatient.id
        }));
        
        const { error: allergiesError } = await supabase
          .from('patient_allergies')
          .insert(allergiesWithPatientId);
          
        if (allergiesError) {
          console.error("Error saving allergies:", allergiesError);
          throw new Error("Erro ao salvar alergias do paciente: " + allergiesError.message);
        }
        
        console.log("Allergies saved successfully");
      }

      // Save documents separately to the patient_documents table
      if (documents && documents.length > 0) {
        console.log("Saving patient documents:", documents);
        
        // Map documents to include patient_id
        const documentsWithPatientId = documents.map((document: any) => ({
          ...document,
          patient_id: savedPatient.id
        }));
        
        const { error: documentsError } = await supabase
          .from('patient_documents')
          .insert(documentsWithPatientId);
          
        if (documentsError) {
          console.error("Error saving documents:", documentsError);
          throw new Error("Erro ao salvar documentos do paciente: " + documentsError.message);
        }
        
        console.log("Documents saved successfully");
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
