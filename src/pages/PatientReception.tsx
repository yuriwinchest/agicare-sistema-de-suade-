import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { patientInfo } from "@/components/patient-record/PatientRecordData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, ClipboardList, Stethoscope, CalendarCheck } from "lucide-react";
import PatientInfoHeader from "@/components/patient-record/PatientInfoHeader";
import { getPatientById, confirmPatientAppointment } from "@/services/patientService";

const specialties = [
  { id: "1", name: "Clínica Médica" },
  { id: "2", name: "Cardiologia" },
  { id: "3", name: "Ortopedia" },
  { id: "4", name: "Pediatria" },
  { id: "5", name: "Ginecologia" },
  { id: "6", name: "Dermatologia" },
];

const professionals = [
  { id: "1", name: "Dr. Ricardo Mendes", specialty: "Cardiologia" },
  { id: "2", name: "Dra. Isabela Rocha", specialty: "Dermatologia" },
  { id: "3", name: "Dr. Fernando Costa", specialty: "Ortopedia" },
  { id: "4", name: "Dra. Camila Santos", specialty: "Pediatria" },
  { id: "5", name: "Dr. Henrique Lima", specialty: "Neurologia" },
  { id: "6", name: "Dra. Laura Almeida", specialty: "Ginecologia" },
];

const healthPlans = [
  { id: "1", name: "UNIMED" },
  { id: "2", name: "AMIL" },
  { id: "3", name: "BRADESCO SAÚDE" },
  { id: "4", name: "SUL AMÉRICA" },
  { id: "5", name: "HAPVIDA" },
  { id: "6", name: "NOTREDAME" },
];

const attendanceTypes = [
  { id: "1", name: "Consulta" },
  { id: "2", name: "Retorno" },
  { id: "3", name: "Procedimento" },
  { id: "4", name: "Exame" },
];

const PatientReception = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [patient, setPatient] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    attendanceType: "",
    specialty: "",
    professional: "",
    healthPlan: "",
    healthCardNumber: "",
    observations: "",
  });
  
  useEffect(() => {
    if (id) {
      const patientData = getPatientById(id);
      if (patientData) {
        setPatient(patientData);
      } else {
        toast({
          title: "Paciente não encontrado",
          description: "Não foi possível encontrar os dados do paciente.",
          variant: "destructive",
        });
      }
    }
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
    
    if (id) {
      const professionalObj = professionals.find(p => p.id === formData.professional);
      const specialtyObj = specialties.find(s => s.id === formData.specialty);
      const attendanceTypeObj = attendanceTypes.find(a => a.id === formData.attendanceType);
      const healthPlanObj = healthPlans.find(h => h.id === formData.healthPlan);
      
      const appointmentData = {
        ...formData,
        professional: professionalObj?.name || "",
        specialty: specialtyObj?.name || "",
        attendanceType: attendanceTypeObj?.name || "",
        healthPlan: healthPlanObj?.name || "",
        status: "Aguardando"
      };
      
      const updatedPatient = confirmPatientAppointment(id, appointmentData);
      
      if (updatedPatient) {
        toast({
          title: "Atendimento registrado",
          description: "O paciente foi encaminhado para atendimento ambulatorial.",
        });
        navigate("/ambulatory");
      } else {
        toast({
          title: "Erro ao registrar atendimento",
          description: "Não foi possível registrar o atendimento do paciente.",
          variant: "destructive",
        });
      }
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
              <Card className="col-span-full md:col-span-2 section-fade system-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <ClipboardList className="h-5 w-5 mr-2 text-teal-500" />
                    Dados do Atendimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="attendanceType" className="text-muted-foreground">
                          Tipo de Atendimento <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.attendanceType}
                          onValueChange={(value) => handleChange("attendanceType", value)}
                        >
                          <SelectTrigger id="attendanceType" className="border-teal-500/20 focus-visible:ring-teal-500/30">
                            <SelectValue placeholder="Selecione o tipo de atendimento" />
                          </SelectTrigger>
                          <SelectContent>
                            {attendanceTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="specialty" className="text-muted-foreground">
                          Especialidade <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.specialty}
                          onValueChange={(value) => handleChange("specialty", value)}
                        >
                          <SelectTrigger id="specialty" className="border-teal-500/20 focus-visible:ring-teal-500/30">
                            <SelectValue placeholder="Selecione a especialidade" />
                          </SelectTrigger>
                          <SelectContent>
                            {specialties.map((specialty) => (
                              <SelectItem key={specialty.id} value={specialty.id}>
                                {specialty.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="professional" className="text-muted-foreground">
                          Profissional <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.professional}
                          onValueChange={(value) => handleChange("professional", value)}
                        >
                          <SelectTrigger id="professional" className="border-teal-500/20 focus-visible:ring-teal-500/30">
                            <SelectValue placeholder="Selecione o profissional" />
                          </SelectTrigger>
                          <SelectContent>
                            {professionals.map((professional) => (
                              <SelectItem key={professional.id} value={professional.id}>
                                {professional.name} - {professional.specialty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="healthPlan" className="text-muted-foreground">
                          Convênio
                        </Label>
                        <Select
                          value={formData.healthPlan}
                          onValueChange={(value) => handleChange("healthPlan", value)}
                        >
                          <SelectTrigger id="healthPlan" className="border-teal-500/20 focus-visible:ring-teal-500/30">
                            <SelectValue placeholder="Selecione o convênio" />
                          </SelectTrigger>
                          <SelectContent>
                            {healthPlans.map((plan) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="healthCardNumber" className="text-muted-foreground">
                          Número da Carteirinha
                        </Label>
                        <Input
                          id="healthCardNumber"
                          value={formData.healthCardNumber}
                          onChange={(e) => handleChange("healthCardNumber", e.target.value)}
                          className="border-teal-500/20 focus-visible:ring-teal-500/30"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="observations" className="text-muted-foreground">
                        Observações
                      </Label>
                      <Textarea
                        id="observations"
                        value={formData.observations}
                        onChange={(e) => handleChange("observations", e.target.value)}
                        className="min-h-32 border-teal-500/20 focus-visible:ring-teal-500/30"
                        placeholder="Insira informações adicionais sobre o atendimento, se necessário."
                      />
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goBack}
                        className="border-teal-500/20 text-teal-600 hover:bg-teal-50 hover:border-teal-500/30"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                      </Button>
                      
                      <Button 
                        type="submit"
                        className="bg-teal-500 text-white hover:bg-teal-600"
                      >
                        Confirmar Atendimento
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="col-span-full md:col-span-1 section-fade system-card h-fit" style={{ animationDelay: "0.1s" }}>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Stethoscope className="h-5 w-5 mr-2 text-teal-500" />
                    Informações do Atendimento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-teal-50 border border-teal-100 rounded-md p-4">
                    <h3 className="font-medium text-teal-700 mb-2 flex items-center">
                      <CalendarCheck className="mr-2 h-4 w-4" /> 
                      Próximos passos
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="bg-teal-200 text-teal-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
                        <span>Preencha os dados do atendimento</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-teal-200 text-teal-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
                        <span>Confirme as informações</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-teal-200 text-teal-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
                        <span>O paciente aparecerá na lista de atendimento ambulatorial</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border border-amber-200 bg-amber-50 rounded-md">
                    <p className="text-sm text-amber-800">
                      Os campos marcados com <span className="text-red-500">*</span> são obrigatórios para continuar o atendimento.
                    </p>
                  </div>
                </CardContent>
              </Card>
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
