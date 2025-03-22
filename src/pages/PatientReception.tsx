
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Save } from "lucide-react";

// Mock de dados do paciente
const mockPatientData = {
  id: "1",
  name: "PACIENTE TESTE",
  birthDate: "01/01/1990",
  cpf: "123.456.789-01",
  phoneNumber: "11 99999-9999",
  reception: "01 - RECEPÇÃO CENTRAL"
};

// Mock de dados para os selects
const unitOptions = [
  { value: "01", label: "01 - MATRIZ GERAL" },
  { value: "02", label: "02 - FILIAL SUL" },
];

const receptionOptions = [
  { value: "01", label: "01 - RECEPÇÃO CENTRAL" },
  { value: "02", label: "02 - RECEPÇÃO PEDIATRIA" },
  { value: "03", label: "03 - RECEPÇÃO ORTOPEDIA" },
];

const professionalOptions = [
  { value: "01", label: "01 - ASSISTENTE SOCIAL" },
  { value: "02", label: "02 - CARDIOLOGISTA" },
  { value: "03", label: "03 - CLÍNICO GERAL" },
];

const attendanceTypeOptions = [
  { value: "01", label: "01 - PRIMEIRA CONSULTA" },
  { value: "02", label: "02 - RETORNO" },
  { value: "03", label: "03 - URGÊNCIA" },
];

const agreementOptions = [
  { value: "01", label: "01 - SUS" },
  { value: "02", label: "02 - PARTICULAR" },
  { value: "03", label: "03 - CONVÊNIO" },
];

const specialtyOptions = [
  { value: "01", label: "01 - CARDIOLOGIA" },
  { value: "02", label: "02 - CLÍNICA MÉDICA" },
  { value: "03", label: "03 - PEDIATRIA" },
];

const PaymentStatus = [
  { value: "01", label: "01 - PENDENTE" },
  { value: "02", label: "02 - PAGO" },
];

const PatientReception = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estados para os campos do formulário
  const [patient, setPatient] = useState(mockPatientData);
  const [unit, setUnit] = useState("");
  const [reception, setReception] = useState(patient.reception.split(" - ")[0] || "");
  const [attendanceType, setAttendanceType] = useState("");
  const [professional, setProfessional] = useState("");
  const [agreement, setAgreement] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [reason, setReason] = useState("");
  const [observations, setObservations] = useState("");
  
  useEffect(() => {
    // Aqui você poderia buscar os dados do paciente baseado no ID
    console.log("Buscando dados do paciente com ID:", id);
    // Por enquanto estamos usando dados fictícios
  }, [id]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui você enviaria os dados para a API
    console.log("Dados do atendimento:", {
      patientId: id,
      unit,
      reception,
      attendanceType,
      professional,
      agreement,
      specialty,
      paymentStatus,
      reason,
      observations
    });
    
    // Exibe mensagem de sucesso
    toast({
      title: "Atendimento registrado",
      description: "O paciente foi encaminhado para o atendimento ambulatorial",
    });
    
    // Redireciona para a página de recepção
    navigate("/ambulatory");
  };
  
  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/reception")}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-semibold ml-2">Complemento de Atendimento</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="col-span-full">
            <CardHeader className="bg-teal-50 pb-2">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-500">P</span>
                </div>
                <div>
                  <CardTitle className="text-lg">Paciente: {patient.id} - {patient.name}</CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-1 mt-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Data de Nascimento:</span> {patient.birthDate}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">CPF:</span> {patient.cpf}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Recepção:</span> {patient.reception}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="unit">Unidade Atendimento</Label>
                  <Select value={unit} onValueChange={setUnit} required>
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reception">Local Atendimento</Label>
                  <Select value={reception} onValueChange={setReception} required>
                    <SelectTrigger id="reception">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {receptionOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="attendance-type">Tipo de Atendimento</Label>
                  <Select value={attendanceType} onValueChange={setAttendanceType} required>
                    <SelectTrigger id="attendance-type">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {attendanceTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="professional">Profissional</Label>
                  <Select value={professional} onValueChange={setProfessional} required>
                    <SelectTrigger id="professional">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionalOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Select value={specialty} onValueChange={setSpecialty} required>
                    <SelectTrigger id="specialty">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialtyOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="agreement">Convênio</Label>
                  <Select value={agreement} onValueChange={setAgreement} required>
                    <SelectTrigger id="agreement">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {agreementOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment">Status Pagamento</Label>
                  <Select value={paymentStatus} onValueChange={setPaymentStatus} required>
                    <SelectTrigger id="payment">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {PaymentStatus.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Responsável</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="reason">Motivo</Label>
                  <Input 
                    id="reason" 
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)} 
                    placeholder="Informe o motivo do atendimento"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsibleName">Responsável</Label>
                  <Input 
                    id="responsibleName" 
                    placeholder="Nome do responsável (se aplicável)" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={observations} 
                onChange={(e) => setObservations(e.target.value)} 
                placeholder="Informações adicionais sobre o atendimento"
                className="min-h-[100px]"
              />
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button type="button" variant="outline" onClick={() => navigate("/reception")}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                <Save className="mr-2 h-4 w-4" />
                Salvar e Encaminhar
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Layout>
  );
};

export default PatientReception;
