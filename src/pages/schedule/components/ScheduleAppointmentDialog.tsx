
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import PatientRegistrationForm from "./PatientRegistrationForm";
import ExamsList from "./ExamsList";
import { Exam } from "../types/scheduleTypes";

interface ScheduleAppointmentDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  scheduleTitle: string;
  scheduleDate: string;
  scheduleTime: string;
}

const ScheduleAppointmentDialog: React.FC<ScheduleAppointmentDialogProps> = ({
  isOpen,
  setIsOpen,
  scheduleTitle,
  scheduleDate,
  scheduleTime,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("appointment");
  const [patientSearch, setPatientSearch] = useState("");
  const [appointmentType, setAppointmentType] = useState("consultation");
  const [isFirstAppointment, setIsFirstAppointment] = useState(false);
  const [requiresPreparation, setRequiresPreparation] = useState(false);
  const [specialCare, setSpecialCare] = useState("");
  const [observations, setObservations] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  
  // Initialize exams with proper type
  const [exams, setExams] = useState<Exam[]>([]);
  const [currentExam, setCurrentExam] = useState<Exam>({
    id: "",
    name: "",
    laterality: "",
    quantity: 1
  });

  // Mock patient search results
  const patientResults = [
    { id: "1", name: "João Silva", phone: "(11) 99999-8888", document: "123.456.789-01" },
    { id: "2", name: "Maria Oliveira", phone: "(11) 97777-6666", document: "987.654.321-01" },
    { id: "3", name: "Carlos Santos", phone: "(11) 95555-4444", document: "456.789.123-01" },
  ];

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient.id);
  };

  const handleScheduleAppointment = () => {
    console.log("Appointment scheduled with patient ID:", selectedPatient);
    console.log("Appointment type:", appointmentType);
    console.log("Is first appointment:", isFirstAppointment);
    console.log("Requires preparation:", requiresPreparation);
    console.log("Special care:", specialCare);
    console.log("Observations:", observations);
    console.log("Exams:", exams);
    
    toast({
      title: "Agendamento realizado com sucesso",
      description: `Paciente agendado para ${scheduleDate} às ${scheduleTime}.`,
    });
    
    setIsOpen(false);
    // Reset form values
    setActiveTab("appointment");
    setPatientSearch("");
    setSelectedPatient("");
    setAppointmentType("consultation");
    setIsFirstAppointment(false);
    setRequiresPreparation(false);
    setSpecialCare("");
    setObservations("");
    setExams([]);
  };

  // Add the addNewExam function to handle adding exams
  const addNewExam = () => {
    // Validate exam before adding
    if (currentExam.id && currentExam.name) {
      setExams([...exams, {...currentExam}]);
      
      // Reset current exam
      setCurrentExam({
        id: "",
        name: "",
        laterality: "",
        quantity: 1
      });
    } else {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha pelo menos o ID e nome do exame.",
        variant: "destructive"
      });
    }
  };

  // Add function to remove an exam
  const removeExam = (examId: string) => {
    setExams(exams.filter(exam => exam.id !== examId));
  };

  // Add function to update current exam
  const updateCurrentExam = (field: keyof Exam, value: string | number) => {
    setCurrentExam(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Agendar Horário</DialogTitle>
          <div className="text-sm text-gray-500 mt-1">
            <p><span className="font-medium">Agenda:</span> {scheduleTitle}</p>
            <p><span className="font-medium">Data/Hora:</span> {scheduleDate} às {scheduleTime}</p>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="appointment" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="appointment">Agendamento</TabsTrigger>
            <TabsTrigger value="patient">Paciente</TabsTrigger>
            <TabsTrigger value="exams">Exames</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointment">
            <div className="space-y-6">
              <div className="bg-gray-100 p-4 rounded-md space-y-4">
                <h3 className="font-medium">Buscar Paciente</h3>
                <div className="flex gap-2">
                  <Input 
                    placeholder="CPF, nome ou telefone do paciente" 
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" className="bg-teal-600 hover:bg-teal-700">
                    Buscar
                  </Button>
                </div>
                
                {patientSearch && (
                  <div className="border rounded-md divide-y">
                    {patientResults.map((patient) => (
                      <div 
                        key={patient.id}
                        className={`p-3 cursor-pointer hover:bg-gray-50 ${selectedPatient === patient.id ? 'bg-gray-100' : ''}`}
                        onClick={() => handlePatientSelect(patient)}
                      >
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-500 flex gap-3">
                          <span>CPF: {patient.document}</span>
                          <span>Tel: {patient.phone}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="appointmentType">Tipo de Atendimento</Label>
                  <RadioGroup 
                    id="appointmentType" 
                    value={appointmentType} 
                    onValueChange={setAppointmentType}
                    className="mt-2 space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="consultation" id="consultation" />
                      <Label htmlFor="consultation" className="font-normal">Consulta</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="return" id="return" />
                      <Label htmlFor="return" className="font-normal">Retorno</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="procedure" id="procedure" />
                      <Label htmlFor="procedure" className="font-normal">Procedimento</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isFirstAppointment" 
                        checked={isFirstAppointment}
                        onCheckedChange={(checked) => 
                          setIsFirstAppointment(checked === true)
                        }
                      />
                      <Label htmlFor="isFirstAppointment" className="font-normal">
                        Primeira Consulta
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="requiresPreparation" 
                        checked={requiresPreparation}
                        onCheckedChange={(checked) => 
                          setRequiresPreparation(checked === true)
                        }
                      />
                      <Label htmlFor="requiresPreparation" className="font-normal">
                        Exige Preparo
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="specialCare">Cuidados Especiais</Label>
                <Select 
                  value={specialCare} 
                  onValueChange={setSpecialCare}
                >
                  <SelectTrigger id="specialCare" className="mt-1">
                    <SelectValue placeholder="Selecione se necessário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    <SelectItem value="wheelchair">Cadeirante</SelectItem>
                    <SelectItem value="visual">Deficiência Visual</SelectItem>
                    <SelectItem value="hearing">Deficiência Auditiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="observations">Observações</Label>
                <Input 
                  id="observations" 
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <DialogFooter className="pt-4 flex items-center justify-between flex-col md:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="mb-3 md:mb-0 w-full md:w-auto"
                >
                  Cancelar
                </Button>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="flex-1 md:flex-none border-teal-600 text-teal-600"
                    onClick={() => setActiveTab("patient")}
                  >
                    Próximo
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleScheduleAppointment}
                    className="flex-1 md:flex-none bg-teal-600 hover:bg-teal-700"
                    disabled={!selectedPatient}
                  >
                    Agendar
                  </Button>
                </div>
              </DialogFooter>
            </div>
          </TabsContent>
          
          <TabsContent value="patient">
            <PatientRegistrationForm 
              onSuccess={(patientName) => {
                toast({
                  title: "Paciente registrado",
                  description: `${patientName} registrado com sucesso!`
                });
                setActiveTab("exams");
              }}
            />
          </TabsContent>
          
          <TabsContent value="exams">
            <ExamsList 
              exams={exams}
              onRemove={removeExam}
              currentExam={currentExam}
              updateCurrentExam={updateCurrentExam}
              addExam={addNewExam}
              onBack={() => setActiveTab("patient")}
              onComplete={handleScheduleAppointment}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleAppointmentDialog;
