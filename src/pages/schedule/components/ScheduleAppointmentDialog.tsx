
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import PatientRegistrationForm from "./PatientRegistrationForm";
import ExamsList from "./ExamsList";
import { Exam, PatientResult } from "../types/scheduleTypes";
import PatientSearch from "./PatientSearch";
import AppointmentDetails from "./AppointmentDetails";
import SchedulingActions from "./SchedulingActions";

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
  const patientResults: PatientResult[] = [
    { id: "1", name: "João Silva", phone: "(11) 99999-8888", document: "123.456.789-01" },
    { id: "2", name: "Maria Oliveira", phone: "(11) 97777-6666", document: "987.654.321-01" },
    { id: "3", name: "Carlos Santos", phone: "(11) 95555-4444", document: "456.789.123-01" },
  ];

  const handlePatientSelect = (patient: PatientResult) => {
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
              <PatientSearch
                patientSearch={patientSearch}
                setPatientSearch={setPatientSearch}
                selectedPatient={selectedPatient}
                handlePatientSelect={handlePatientSelect}
                patientResults={patientResults}
              />
              
              <AppointmentDetails
                appointmentType={appointmentType}
                setAppointmentType={setAppointmentType}
                isFirstAppointment={isFirstAppointment}
                setIsFirstAppointment={setIsFirstAppointment}
                requiresPreparation={requiresPreparation}
                setRequiresPreparation={setRequiresPreparation}
                specialCare={specialCare}
                setSpecialCare={setSpecialCare}
                observations={observations}
                setObservations={setObservations}
              />
              
              <SchedulingActions
                onCancel={() => setIsOpen(false)}
                onNext={() => setActiveTab("patient")}
                onSchedule={handleScheduleAppointment}
                disableSchedule={!selectedPatient}
              />
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
