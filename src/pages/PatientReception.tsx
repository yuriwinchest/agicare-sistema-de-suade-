
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PatientInfoHeader from "@/components/patient-record/PatientInfoHeader";
import { getPatientById, confirmPatientAppointment } from "@/services/patientService";
import { PatientReceptionForm } from "@/components/patient-reception/PatientReceptionForm";
import { InformationCard } from "@/components/patient-reception/InformationCard";
import { specialties, professionals, healthPlans, attendanceTypes } from "@/components/patient-reception/constants";

const PatientReception = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [patient, setPatient] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    attendanceType: "",
    specialty: "",
    professional: "",
    healthPlan: "",
    healthCardNumber: "",
    observations: "",
    appointmentTime: ""
  });
  
  useEffect(() => {
    const loadPatient = async () => {
      if (id) {
        try {
          const patientData = await getPatientById(id);
          if (patientData) {
            const formattedPatient = {
              ...patientData,
              allergies: patientData.allergies || []
            };
            setPatient(formattedPatient);
          } else {
            toast({
              title: "Paciente não encontrado",
              description: "Não foi possível encontrar os dados do paciente.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error loading patient:", error);
          toast({
            title: "Erro ao carregar dados",
            description: "Ocorreu um erro ao buscar os dados do paciente.",
            variant: "destructive",
          });
        }
      }
    };
    
    loadPatient();
  }, [id, toast]);
  
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.attendanceType || !formData.specialty || !formData.professional) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    if (id) {
      // Find the respective objects based on selected IDs
      const professionalObj = professionals.find(p => p.id === formData.professional);
      const specialtyObj = specialties.find(s => s.id === formData.specialty);
      const attendanceTypeObj = attendanceTypes.find(a => a.id === formData.attendanceType);
      const healthPlanObj = healthPlans.find(h => h.id === formData.healthPlan);
      
      console.log("Submitting form data:", { 
        formData, 
        professional: professionalObj,
        specialty: specialtyObj,
        attendanceType: attendanceTypeObj,
        healthPlan: healthPlanObj
      });
      
      const appointmentData = {
        ...formData,
        professional: professionalObj?.name || "",
        specialty: specialtyObj?.name || "",
        attendanceType: attendanceTypeObj?.name || "",
        healthPlan: healthPlanObj?.name || "",
        status: "Enfermagem"
      };
      
      confirmPatientAppointment(id, appointmentData)
        .then(updatedPatient => {
          if (updatedPatient) {
            toast({
              title: "Atendimento registrado",
              description: "O paciente foi encaminhado para a enfermagem.",
            });
            navigate("/ambulatory");
          } else {
            toast({
              title: "Erro ao registrar atendimento",
              description: "Não foi possível registrar o atendimento do paciente.",
              variant: "destructive",
            });
          }
        })
        .catch(error => {
          console.error("Error confirming appointment:", error);
          toast({
            title: "Erro ao registrar atendimento",
            description: "Ocorreu um erro ao processar a requisição: " + (error.message || "Erro desconhecido"),
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };
  
  const goBack = () => {
    navigate("/reception");
  };
  
  return (
    <Layout>
      <div className="page-container">
        {patient ? (
          <>
            <PatientInfoHeader patientInfo={patient} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <PatientReceptionForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                goBack={goBack}
                isSubmitting={isSubmitting}
              />
              <InformationCard />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-96">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Paciente não encontrado</h2>
            <p className="text-muted-foreground mb-4">Não foi possível encontrar os dados do paciente.</p>
            <Button onClick={goBack}>Voltar para Recepção</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PatientReception;
