import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PatientInfoHeader from "@/components/patient-record/PatientInfoHeader";
import { getPatientById } from "@/services/patientService";
import { PatientReceptionForm } from "@/components/patient-reception/PatientReceptionForm";
import { InformationCard } from "@/components/patient-reception/InformationCard";
import { paymentService } from "@/services/payments";

const PatientReception = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [patient, setPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    attendance_type: "",
    specialty: "",
    professional: "",
    healthPlan: "",
    health_card_number: "",
    observations: "",
    appointment_time: "",
    origin_location: "1", // "Próprio Paciente" é o valor padrão
    procedure: "",
    responsible_name: "",
    responsible_document: "",
    responsible_relationship: "",
    // Novos campos de pagamento
    payment_method: "",
    payment_amount: "",
    payment_notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const loadPatient = async () => {
      if (id) {
        try {
          setIsLoading(true);
          console.log("Buscando dados do paciente com ID:", id);
          const patientData = await getPatientById(id);
          console.log("Dados recebidos:", patientData);
          
          if (!patientData) {
            console.error("Paciente não encontrado ou dados inválidos");
            toast({
              title: "Paciente não encontrado",
              description: "Não foi possível encontrar os dados do paciente.",
              variant: "destructive",
            });
            navigate("/reception");
          } else {
            // Garante que todas as propriedades necessárias existam
            const safePatientData = {
              ...patientData,
              // Garantir que estas propriedades existam para evitar erros no PatientInfoHeader
              id: patientData.id || id,
              name: patientData.name || "Paciente sem nome",
              protocol_number: patientData.protocol_number || null,
              age: patientData.age || null,
              birthdate: patientData.birthdate || null,
              gender: patientData.gender || null,
              allergies: patientData.allergies || []
            };
            
            setPatient(safePatientData);
            
            // Se o paciente tiver convênio, preencher automaticamente
            if (patientData.healthPlan) {
              setFormData(prev => ({
                ...prev,
                healthPlan: patientData.healthPlan,
                health_card_number: patientData.healthPlanNumber || "",
                payment_method: "HEALTH_INSURANCE"
              }));
            }
          }
        } catch (error) {
          console.error("Error loading patient:", error);
          toast({
            title: "Erro ao carregar dados",
            description: "Ocorreu um erro ao buscar os dados do paciente.",
            variant: "destructive",
          });
          navigate("/reception");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadPatient();
  }, [id, toast, navigate]);
  
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validar campos obrigatórios
    if (!formData.attendance_type || !formData.specialty || !formData.professional || !formData.origin_location) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Simular um envio para API para criar o agendamento
      console.log("Enviando dados de atendimento:", formData);
      
      // Simular a criação de um agendamento e obter o ID
      const appointmentId = "appt_" + Date.now().toString();
      
      // Se tiver informações de pagamento, registrar o pagamento
      if (formData.payment_method) {
        const paymentAmount = formData.payment_amount ? 
          parseInt(formData.payment_amount) / 100 : 0;
        
        try {
          await paymentService.createPayment({
            appointmentId,
            amount: paymentAmount,
            paymentMethod: formData.payment_method as any,
            notes: formData.payment_notes
          });
          
          console.log("Pagamento registrado com sucesso");
        } catch (paymentError) {
          console.error("Erro ao registrar pagamento:", paymentError);
          // Continuar mesmo com erro no pagamento, mas avisar o usuário
          toast({
            title: "Atenção",
            description: "Atendimento registrado, mas houve um erro ao registrar o pagamento.",
            variant: "warning",
          });
        }
      }
      
      // Aguardar para simular o tempo de resposta da API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Atendimento registrado",
        description: "O paciente foi registrado para atendimento com sucesso!",
      });
      
      // Redirecionar para a tela de recepção
      navigate("/reception");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao registrar atendimento",
        description: "Não foi possível registrar o atendimento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const goBack = () => {
    navigate("/reception");
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="page-container">
          <div className="flex justify-center items-center h-64">
            <p>Carregando informações do paciente...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="page-container">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            onClick={goBack}
            className="border-teal-500/20 text-teal-600 hover:bg-teal-50 hover:border-teal-500/30"
          >
            Voltar para Recepção
          </Button>
        </div>
        
        {patient && <PatientInfoHeader patientInfo={patient} />}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <PatientReceptionForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            goBack={goBack}
            isSubmitting={isSubmitting}
          />
          
          <InformationCard />
        </div>
      </div>
    </Layout>
  );
};

export default PatientReception;
