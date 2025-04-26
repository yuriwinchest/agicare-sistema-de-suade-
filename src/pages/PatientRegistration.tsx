import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MultiStepRegistrationDialog from "@/components/patient-registration/MultiStepRegistrationDialog";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/components/auth/AuthContext";
import { isValidBirthDate, formatDateForDatabase } from "@/services/patients/utils/dateUtils";

const PatientRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Acesso Negado",
        description: "Você precisa estar logado para registrar pacientes.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleComplete = async (formData: any) => {
    if (!isAuthenticated) {
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
      console.log("Saving patient data:", formData);
      
      // Validate birth date if provided
      if (formData.birth_date && !isValidBirthDate(formData.birth_date)) {
        toast({
          title: "Erro ao salvar",
          description: "Data de nascimento inválida. Use o formato DD/MM/AAAA com ano entre 1900 e hoje.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Store fields that should go to patient_additional_data
      const reception = formData.reception || "RECEPÇÃO CENTRAL";
      const specialty = formData.specialty || null;
      const professional = formData.professional || null;
      const healthPlan = formData.healthPlan || null;
      
      // Format basic patient data - excluding fields not in patients table
      const patientData = {
        name: formData.name,
        cpf: formData.cpf || null,
        email: formData.email || null,
        phone: formData.phone || null,
        gender: formData.gender || null,
        birth_date: formData.birth_date ? formatDateForDatabase(formData.birth_date) : null,
        father_name: formData.father_name || null,
        mother_name: formData.mother_name || null,
        address: formData.address || null,
        status: "Agendado",
        person_type: formData.person_type || null
      };

      console.log("Formatted data for Supabase:", patientData);
      
      // Insert directly into Supabase
      const { data: savedPatient, error } = await supabase
        .from('patients')
        .insert(patientData)
        .select()
        .single();
      
      if (error) {
        console.error("Error saving patient:", error);
        toast({
          title: "Erro ao salvar",
          description: `Ocorreu um erro: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      const patientId = savedPatient.id;
      console.log("Patient saved with ID:", patientId);
      
      // Save documents if provided
      if (formData.documents && formData.documents.length > 0) {
        for (const doc of formData.documents) {
          // Check if document has required fields
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
      
      // Save allergies if provided
      if (formData.allergies && formData.allergies.length > 0) {
        for (const allergy of formData.allergies) {
          // Check if allergy has required fields
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
      
      // Save complementary data including specialty
      const additionalData = {
        id: patientId,
        health_plan: healthPlan,
        professional: professional,
        reception: reception,
        specialty: specialty
      };
      
      if (formData.additionalData) {
        Object.assign(additionalData, formData.additionalData);
      }
      
      await supabase.from('patient_additional_data').insert(additionalData);
      
      // Register registration log
      await supabase.from('patient_logs').insert({
        patient_id: patientId,
        action: "Cadastro",
        description: `Paciente cadastrado via formulário completo.`,
        performed_by: "Sistema"
      });
      
      toast({
        title: "Cadastro Salvo",
        description: "Os dados do paciente foram salvos com sucesso.",
        variant: "success"
      });
      
      // Wait a moment before navigating to ensure the toast is visible
      setTimeout(() => {
        navigate("/reception");
      }, 1500);
    } catch (error: any) {
      console.error("Error saving patient:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao processar a requisição.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={handleGoBack} className="text-primary hover:bg-primary-light/10">
            Voltar
          </Button>
          <div className="text-xl font-semibold text-primary-dark">
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
