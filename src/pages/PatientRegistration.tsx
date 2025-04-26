
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { saveCompletePatient } from "@/services/patients/mutations/completeMutations";
import MultiStepRegistrationDialog from "@/components/patient-registration/MultiStepRegistrationDialog";
import { Toaster } from "@/components/ui/toaster";

const PatientRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleComplete = async (formData: any) => {
    try {
      setIsSubmitting(true);
      console.log("Salvando dados do paciente:", formData);
      
      // Formatar dados do paciente para gravação adequada
      const patientData = {
        ...formData,
        status: "Agendado",
        reception: formData.reception || "RECEPÇÃO CENTRAL",
        specialty: formData.specialty || null,
        professional: formData.professional || null,
        health_plan: formData.healthPlan || null,
        date: formData.date || null,
        appointmentTime: formData.appointmentTime || null
      };

      // Separar dados adicionais, documentos e alergias para gravação adequada
      const additionalData = formData.additionalData || null;
      const documents = formData.documents || null;
      const allergies = formData.allergies || null;
      const observations = formData.observations || null;

      // Chamar a função de gravação completa
      const success = await saveCompletePatient(
        patientData,
        additionalData,
        documents,
        allergies,
        observations
      );

      if (success) {
        toast({
          title: "Cadastro Salvo",
          description: "Os dados do paciente foram salvos com sucesso."
        });
        
        // Aguardar um momento antes de navegar para garantir que o toast seja visível
        setTimeout(() => {
          navigate("/reception");
        }, 1500);
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao salvar os dados do paciente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao salvar paciente:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao processar a requisição.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            Voltar
          </Button>
          <div className="text-xl font-semibold text-teal-700">
            Cadastro do Paciente
          </div>
          <div> </div>
        </div>

        <MultiStepRegistrationDialog
          isOpen={isDialogOpen}
          onClose={() => navigate("/reception")}
          onComplete={handleComplete}
          isSubmitting={isSubmitting}
        />
        
        <Toaster />
      </div>
    </Layout>
  );
};

export default PatientRegistration;
