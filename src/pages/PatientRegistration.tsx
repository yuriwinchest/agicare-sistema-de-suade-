
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
      
      // Formatar dados básicos do paciente
      const patientData = {
        name: formData.name,
        cpf: formData.cpf || null,
        email: formData.email || null,
        phone: formData.phone || null,
        gender: formData.gender || null,
        birth_date: formData.birth_date || null,
        father_name: formData.father_name || null,
        mother_name: formData.mother_name || null,
        address: formData.address || null,
        status: "Agendado",
        reception: formData.reception || "RECEPÇÃO CENTRAL",
        specialty: formData.specialty || null,
        professional: formData.professional || null,
        health_plan: formData.healthPlan || null,
        attendance_type: formData.specialty || null,
        person_type: formData.person_type || null,
        // Removido o campo date que não existe na tabela patients
      };

      console.log("Dados formatados para supabase:", patientData);
      
      // Inserir diretamente no supabase
      const { data: savedPatient, error } = await supabase
        .from('patients')
        .insert(patientData)
        .select()
        .single();
      
      if (error) {
        console.error("Erro ao salvar paciente:", error);
        toast({
          title: "Erro ao salvar",
          description: `Ocorreu um erro: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      const patientId = savedPatient.id;
      console.log("Paciente salvo com ID:", patientId);
      
      // Salvar documentos se fornecidos
      if (formData.documents && formData.documents.length > 0) {
        for (const doc of formData.documents) {
          // Verificar se o documento tem os campos necessários
          if (doc && doc.documentType && doc.documentNumber) {
            const docData = {
              patient_id: patientId,
              document_type: typeof doc.documentType === 'object' ? doc.documentType.value : doc.documentType,
              document_number: typeof doc.documentNumber === 'object' ? doc.documentNumber.value : doc.documentNumber,
              issuing_body: doc.issuingBody || "",
              issue_date: doc.issueDate || null
            };
            
            await supabase.from('patient_documents').insert(docData);
          }
        }
      }
      
      // Salvar alergias se fornecidas
      if (formData.allergies && formData.allergies.length > 0) {
        for (const allergy of formData.allergies) {
          // Verificar se a alergia tem os campos necessários
          if (allergy && allergy.allergyType && allergy.description) {
            const allergyData = {
              patient_id: patientId,
              allergy_type: typeof allergy.allergyType === 'object' ? allergy.allergyType.value : allergy.allergyType,
              description: allergy.description,
              severity: allergy.severity || "Média"
            };
            
            await supabase.from('patient_allergies').insert(allergyData);
          }
        }
      }
      
      // Salvar dados complementares se fornecidos
      if (formData.healthPlan || formData.additionalData) {
        const additionalData = {
          id: patientId,
          health_plan: formData.healthPlan || null
        };
        
        if (formData.additionalData) {
          Object.assign(additionalData, formData.additionalData);
        }
        
        await supabase.from('patient_additional_data').insert(additionalData);
      }
      
      // Registrar log de cadastro
      await supabase.from('patient_logs').insert({
        patient_id: patientId,
        action: "Cadastro",
        description: `Paciente cadastrado via formulário completo.`,
        performed_by: "Sistema"
      });
      
      toast({
        title: "Cadastro Salvo",
        description: "Os dados do paciente foram salvos com sucesso."
      });
      
      // Aguardar um momento antes de navegar para garantir que o toast seja visível
      setTimeout(() => {
        navigate("/reception");
      }, 1500);
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
