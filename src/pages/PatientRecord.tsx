
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertCircle, 
  ChevronLeft, 
  FileText, 
  Stethoscope, 
  Activity, 
  Pill, 
  FlaskConical, 
  ClipboardList, 
  UserCheck, 
  Bed,
  Plus,
  Search,
  Calendar,
  Check,
  X,
  ClipboardList as ClipboardIcon,
} from "lucide-react";

// Mock patient data
const patientInfo = {
  id: "001",
  name: "Carlos Ferreira",
  age: 42,
  birthdate: "10/08/1980",
  gender: "Masculino",
  allergies: [
    { substance: "Penicilina", reaction: "Urticária e prurido" },
    { substance: "Dipirona", reaction: "Angioedema" }
  ],
  vitalSigns: [
    { date: "19/05/2023 09:30", temperature: "38.5°C", pressure: "130/85", pulse: "88bpm", respiratory: "18rpm", oxygen: "96%" },
    { date: "19/05/2023 08:15", temperature: "38.7°C", pressure: "135/90", pulse: "92bpm", respiratory: "20rpm", oxygen: "95%" }
  ],
  medicalNotes: [
    { 
      id: "note1", 
      date: "19/05/2023 09:30", 
      title: "Evolução Médica", 
      doctor: "Dr. Ana Silva", 
      content: "Paciente relata febre há 3 dias, acompanhada de dor abdominal difusa e vômitos. Ao exame: abdome doloroso à palpação em quadrante inferior direito, com sinal de Blumberg positivo. Suspeita de apendicite aguda, solicitados exames complementares." 
    },
    { 
      id: "note2", 
      date: "19/05/2023 08:15", 
      title: "Avaliação Inicial", 
      doctor: "Dr. Ana Silva", 
      content: "Paciente deu entrada no PS com queixa de febre e dor abdominal. Iniciada investigação diagnóstica." 
    }
  ],
  labTests: [
    { id: "exam1", date: "19/05/2023 10:00", name: "Hemograma Completo", status: "Pendente" },
    { id: "exam2", date: "19/05/2023 10:00", name: "PCR", status: "Pendente" },
    { id: "exam3", date: "19/05/2023 10:00", name: "Tomografia de Abdome", status: "Agendado" }
  ],
  prescriptions: [
    { 
      id: "presc1", 
      date: "19/05/2023 09:45", 
      doctor: "Dr. Ana Silva",
      items: [
        { medication: "Dipirona", dose: "1g", frequency: "6/6h", route: "EV" },
        { medication: "Ondansetrona", dose: "4mg", frequency: "8/8h", route: "EV" },
        { medication: "Soro Fisiológico 0,9%", dose: "1000ml", frequency: "12/12h", route: "EV" }
      ],
      nursingInstructions: [
        { instruction: "Monitorar temperatura", frequency: "4/4h" },
        { instruction: "Controle de diurese", frequency: "Contínuo" }
      ],
      diet: "Dieta zero até liberação médica"
    }
  ]
};

// Mock available medical forms
const availableForms = [
  { id: "form1", title: "Evolução Médica" },
  { id: "form2", title: "Anamnese" },
  { id: "form3", title: "Exame Físico" },
  { id: "form4", title: "Laudo para Solicitação de AIH" },
  { id: "form5", title: "Receituário" },
  { id: "form6", title: "Atestado Médico" },
];

// Mock available medications
const availableMedications = [
  { id: "med1", name: "Dipirona" },
  { id: "med2", name: "Ondansetrona" },
  { id: "med3", name: "Paracetamol" },
  { id: "med4", name: "Ibuprofeno" },
  { id: "med5", name: "Amoxicilina" },
  { id: "med6", name: "Metoclopramida" },
  { id: "med7", name: "Soro Fisiológico 0,9%" },
  { id: "med8", name: "Soro Glicosado 5%" },
];

// Mock available nursing instructions
const availableNursingInstructions = [
  { id: "instr1", name: "Monitorar temperatura" },
  { id: "instr2", name: "Controle de diurese" },
  { id: "instr3", name: "Monitorar pressão arterial" },
  { id: "instr4", name: "Monitorar saturação de O2" },
  { id: "instr5", name: "Curativo simples" },
  { id: "instr6", name: "Aplicação de compressa fria" },
];

// Mock available diets
const availableDiets = [
  { id: "diet1", name: "Dieta zero" },
  { id: "diet2", name: "Dieta líquida" },
  { id: "diet3", name: "Dieta branda" },
  { id: "diet4", name: "Dieta geral" },
  { id: "diet5", name: "Dieta hipossódica" },
  { id: "diet6", name: "Dieta para diabéticos" },
];

// Mock available exams
const availableExams = {
  laboratory: [
    { id: "lab1", name: "Hemograma Completo" },
    { id: "lab2", name: "PCR" },
    { id: "lab3", name: "VHS" },
    { id: "lab4", name: "Glicemia" },
    { id: "lab5", name: "Ureia e Creatinina" },
    { id: "lab6", name: "Eletrólitos" },
    { id: "lab7", name: "Coagulograma" },
    { id: "lab8", name: "Função Hepática" },
  ],
  imaging: [
    { id: "img1", name: "Raio-X de Tórax" },
    { id: "img2", name: "Raio-X de Abdome" },
    { id: "img3", name: "Ultrassonografia Abdominal" },
    { id: "img4", name: "Tomografia de Abdome" },
    { id: "img5", name: "Tomografia de Tórax" },
    { id: "img6", name: "Ressonância Magnética" },
  ],
  cardiological: [
    { id: "card1", name: "Eletrocardiograma" },
    { id: "card2", name: "Ecocardiograma" },
    { id: "card3", name: "Teste Ergométrico" },
    { id: "card4", name: "Holter 24h" },
  ],
};

const PatientRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("summary");
  const [showAllergies, setShowAllergies] = useState(false);
  
  const [selectedForm, setSelectedForm] = useState("");
  const [formContent, setFormContent] = useState("");
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  
  const [showExamDialog, setShowExamDialog] = useState(false);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [examSearchTerm, setExamSearchTerm] = useState("");
  const [activeExamCategory, setActiveExamCategory] = useState("laboratory");
  
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);
  const [prescriptionItems, setPrescriptionItems] = useState<any[]>([]);
  const [nursingInstructions, setNursingInstructions] = useState<any[]>([]);
  const [selectedDiet, setSelectedDiet] = useState("");
  const [currentMedication, setCurrentMedication] = useState("");
  const [currentDose, setCurrentDose] = useState("");
  const [currentFrequency, setCurrentFrequency] = useState("");
  const [currentRoute, setCurrentRoute] = useState("");
  
  const [currentInstruction, setCurrentInstruction] = useState("");
  const [currentInstructionFreq, setCurrentInstructionFreq] = useState("");
  
  // New state for clinical record
  const [searchClinicalRecord, setSearchClinicalRecord] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  
  // Mock clinical records
  const clinicalRecords = [
    { id: "10001", number: "12345", date: "02/05/2023 14:39", speciality: "CARDIOLOGIA", professional: "MÉDICO PADRÃO", type: "FICHA DE ATENDIMENTO", status: "FINALIZADA" },
    { id: "10002", number: "21576", date: "05/04/2023 10:15", speciality: "ANESTESIOLOGIA", professional: "MÉDICO PADRÃO", type: "FICHA DE ATENDIMENTO", status: "PENDENTE" },
    { id: "10003", number: "31255", date: "20/03/2023 08:54", speciality: "CARDIOLOGIA", professional: "MÉDICO PADRÃO", type: "FICHA DE EVOLUÇÃO", status: "FINALIZADA" },
    { id: "10004", number: "41236", date: "15/02/2023 16:30", speciality: "CLÍNICA MÉDICA", professional: "MÉDICO PADRÃO", type: "FICHA DE ATENDIMENTO", status: "FINALIZADA" },
    { id: "10005", number: "51377", date: "10/01/2023 09:20", speciality: "NEUROLOGIA", professional: "MÉDICO PADRÃO", type: "FICHA DE AVALIAÇÃO", status: "FINALIZADA" },
    { id: "10006", number: "61238", date: "05/12/2022 11:45", speciality: "CARDIOLOGIA", professional: "MÉDICO PADRÃO", type: "FICHA DE ATENDIMENTO", status: "FINALIZADA" },
    { id: "10007", number: "71288", date: "20/11/2022 13:10", speciality: "CLÍNICA MÉDICA", professional: "MÉDICO PADRÃO", type: "FICHA DE EVOLUÇÃO", status: "FINALIZADA" },
    { id: "10008", number: "81356", date: "15/10/2022 15:25", speciality: "ANESTESIOLOGIA", professional: "MÉDICO PADRÃO", type: "FICHA DE AVALIAÇÃO", status: "FINALIZADA" },
    { id: "10009", number: "90408", date: "28/09/2022 10:50", speciality: "MÉDICO PEDIATRA NEONATOLOGISTA JÚNIOR", professional: "MÉDICO PADRÃO", type: "FICHA TÉCNICA", status: "FINALIZADA" },
    { id: "10010", number: "12405", date: "08/08/2022 14:30", speciality: "ORTOPEDIA / TRAUMATOLOGIA", professional: "MÉDICO PADRÃO", type: "FICHA CLÍNICA", status: "FINALIZADA" },
  ];
  
  // Available specialities for filtering
  const specialities = [
    { id: "spec1", name: "CARDIOLOGIA" },
    { id: "spec2", name: "ANESTESIOLOGIA" },
    { id: "spec3", name: "CLÍNICA MÉDICA" },
    { id: "spec4", name: "NEUROLOGIA" },
    { id: "spec5", name: "ORTOPEDIA / TRAUMATOLOGIA" },
    { id: "spec6", name: "PEDIATRIA" },
  ];
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleCreateForm = () => {
    if (!selectedForm || !formContent.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos do formulário",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Formulário Salvo",
      description: "O documento foi salvo no prontuário do paciente",
    });
    
    setIsFormDialogOpen(false);
    setSelectedForm("");
    setFormContent("");
  };
  
  const handleAddMedication = () => {
    if (!currentMedication || !currentDose || !currentFrequency || !currentRoute) {
      toast({
        description: "Preencha todos os campos da medicação",
        variant: "destructive",
      });
      return;
    }
    
    setPrescriptionItems([
      ...prescriptionItems,
      {
        medication: currentMedication,
        dose: currentDose,
        frequency: currentFrequency,
        route: currentRoute
      }
    ]);
    
    setCurrentMedication("");
    setCurrentDose("");
    setCurrentFrequency("");
    setCurrentRoute("");
  };
  
  const handleAddInstruction = () => {
    if (!currentInstruction || !currentInstructionFreq) {
      toast({
        description: "Preencha todos os campos da orientação",
        variant: "destructive",
      });
      return;
    }
    
    setNursingInstructions([
      ...nursingInstructions,
      {
        instruction: currentInstruction,
        frequency: currentInstructionFreq
      }
    ]);
    
    setCurrentInstruction("");
    setCurrentInstructionFreq("");
  };
  
  const handleRemoveMedication = (index: number) => {
    setPrescriptionItems(prescriptionItems.filter((_, i) => i !== index));
  };
  
  const handleRemoveInstruction = (index: number) => {
    setNursingInstructions(nursingInstructions.filter((_, i) => i !== index));
  };
  
  const handleSavePrescription = () => {
    if (prescriptionItems.length === 0) {
      toast({
        description: "Adicione pelo menos um item à prescrição",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Prescrição Salva",
      description: "A prescrição foi salva no prontuário do paciente",
    });
    
    setShowPrescriptionDialog(false);
    setPrescriptionItems([]);
    setNursingInstructions([]);
    setSelectedDiet("");
  };
  
  const handleToggleExam = (examName: string) => {
    if (selectedExams.includes(examName)) {
      setSelectedExams(selectedExams.filter(name => name !== examName));
    } else {
      setSelectedExams([...selectedExams, examName]);
    }
  };
  
  const handleSaveExams = () => {
    if (selectedExams.length === 0) {
      toast({
        description: "Selecione pelo menos um exame",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Exames Solicitados",
      description: `${selectedExams.length} exames foram solicitados com sucesso`,
    });
    
    setShowExamDialog(false);
    setSelectedExams([]);
    setExamSearchTerm("");
  };
  
  const getFilteredExams = () => {
    const exams = availableExams[activeExamCategory as keyof typeof availableExams];
    if (!examSearchTerm) return exams;
    
    return exams.filter(exam => 
      exam.name.toLowerCase().includes(examSearchTerm.toLowerCase())
    );
  };
  
  const handleFinalizeConsult = () => {
    toast({
      title: "Atendimento Finalizado",
      description: "O atendimento foi finalizado com sucesso",
    });
    navigate(-1);
  };
  
  const handleCreateObservation = () => {
    toast({
      title: "Paciente em Observação",
      description: "O paciente foi colocado em observação",
    });
  };
  
  const handleAddClinicalRecord = () => {
    toast({
      title: "Nova Ficha Clínica",
      description: "Funcionalidade em desenvolvimento",
    });
  };
  
  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleCreateObservation}>
              Observação
            </Button>
            <Button size="sm" onClick={handleFinalizeConsult}>
              Finalizar Atendimento
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card className="col-span-full section-fade">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight mb-1">{patientInfo.name}</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Registro:</span> {patientInfo.id}
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Idade:</span> {patientInfo.age} anos
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Nascimento:</span> {patientInfo.birthdate}
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Gênero:</span> {patientInfo.gender}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => setShowAllergies(!showAllergies)}
                  >
                    <AlertCircle className="text-amber-500 h-5 w-5 mr-1" />
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Alergias: {patientInfo.allergies.length}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {showAllergies && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <h3 className="font-medium text-amber-800 mb-2">Alergias Registradas</h3>
                  <ul className="space-y-2">
                    {patientInfo.allergies.map((allergy, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-medium">{allergy.substance}:</span> {allergy.reaction}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="section-fade" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-0">
            <Tabs defaultValue="summary" onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b h-auto">
                <TabsTrigger value="summary" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  Resumo
                </TabsTrigger>
                <TabsTrigger value="anamnesis" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <FileText className="h-4 w-4 mr-1" />
                  Anamnese
                </TabsTrigger>
                <TabsTrigger value="nursing" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <Activity className="h-4 w-4 mr-1" />
                  Enfermagem
                </TabsTrigger>
                <TabsTrigger value="prescription" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <Pill className="h-4 w-4 mr-1" />
                  Prescrição
                </TabsTrigger>
                <TabsTrigger value="laborders" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <FlaskConical className="h-4 w-4 mr-1" />
                  Pedidos
                </TabsTrigger>
                <TabsTrigger value="labresults" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <ClipboardList className="h-4 w-4 mr-1" />
                  Resultados
                </TabsTrigger>
                <TabsTrigger value="clinical" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <ClipboardIcon className="h-4 w-4 mr-1" />
                  Ficha Clínica
                </TabsTrigger>
                <TabsTrigger value="discharge" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <UserCheck className="h-4 w-4 mr-1" />
                  Alta/Atestado
                </TabsTrigger>
                <TabsTrigger value="hospitalization" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <Bed className="h-4 w-4 mr-1" />
                  Internação
                </TabsTrigger>
              </TabsList>
              
              {/* Summary Tab */}
              <TabsContent value="summary" className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Sinais Vitais Recentes</h2>
                    {patientInfo.vitalSigns.length > 0 ? (
                      <div className="space-y-4">
                        {patientInfo.vitalSigns.map((vs, index) => (
                          <div key={index} className="p-3 bg-white border rounded-md shadow-sm">
                            <div className="flex justify-between mb-2">
                              <p className="text-sm text-muted-foreground">{vs.date}</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              <div>
                                <p className="text-xs text-muted-foreground">Temperatura</p>
                                <p className="font-medium">{vs.temperature}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Pressão Arterial</p>
                                <p className="font-medium">{vs.pressure}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Pulso</p>
                                <p className="font-medium">{vs.pulse}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Freq. Respiratória</p>
                                <p className="font-medium">{vs.respiratory}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Saturação O2</p>
                                <p className="font-medium">{vs.oxygen}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nenhum sinal vital registrado</p>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Últimas Evoluções</h2>
                    {patientInfo.medicalNotes.length > 0 ? (
                      <div className="space-y-4">
                        {patientInfo.medicalNotes.map((note) => (
                          <div key={note.id} className="p-3 bg-white border rounded-md shadow-sm">
                            <div className="flex justify-between mb-2">
                              <h3 className="font-medium">{note.title}</h3>
                              <p className="text-sm text-muted-foreground">{note.date}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">Por: {note.doctor}</p>
                            <p className="text-sm">{note.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nenhuma evolução registrada</p>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Prescrições Ativas</h2>
                    {patientInfo.prescriptions.length > 0 ? (
                      <div className="space-y-4">
                        {patientInfo.prescriptions.map((prescription) => (
                          <div key={prescription.id} className="p-3 bg-white border rounded-md shadow-sm">
                            <div className="flex justify-between mb-2">
                              <h3 className="font-medium">Prescrição Médica</h3>
                              <p className="text-sm text-muted-foreground">{prescription.date}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">Por: {prescription.doctor}</p>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Medicações:</h4>
                              <ul className="space-y-1">
                                {prescription.items.map((item, index) => (
                                  <li key={index} className="text-sm">
                                    {item.medication} {item.dose}, {item.frequency}, {item.route}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <Separator className="my-2" />
                            <div>
                              <h4 className="text-sm font-medium mb-1">Dieta:</h4>
                              <p className="text-sm">{prescription.diet}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nenhuma prescrição ativa</p>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Exames Solicitados</h2>
                    {patientInfo.labTests.length > 0 ? (
                      <div className="space-y-2">
                        {patientInfo.labTests.map((test) => (
                          <div key={test.id} className="flex items-center justify-between p-3 bg-white border rounded-md shadow-sm">
                            <div>
                              <h3 className="font-medium">{test.name}</h3>
                              <p className="text-sm text-muted-foreground">{test.date}</p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={
                                test.status === "Pendente" 
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100" 
                                  : test.status === "Agendado"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                    : "bg-green-100 text-green-800 hover:bg-green-100"
                              }
                            >
                              {test.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nenhum exame solicitado</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              {/* Anamnesis Tab */}
              <TabsContent value="anamnesis" className="p-6">
                <div className="flex justify-between mb-6">
                  <h2 className="text-lg font-semibold">Anamnese e Documentação</h2>
                  
                  <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Ficha
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Criar Nova Ficha</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="form">Selecione o Tipo de Documento</Label>
                          <Select value={selectedForm} onValueChange={setSelectedForm}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de documento" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableForms.map((form) => (
                                <SelectItem key={form.id} value={form.id}>
                                  {form.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="content">Conteúdo</Label>
                          <Textarea 
                            id="content"
                            value={formContent}
                            onChange={(e) => setFormContent(e.target.value)}
                            rows={12}
                            placeholder="Digite o conteúdo do documento aqui..."
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleCreateForm}>
                          Salvar
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="space-y-4">
                  {patientInfo.medicalNotes.map((note) => (
                    <div key={note.id} className="p-4 bg-white border rounded-md shadow-sm">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{note.title}</h3>
                        <div className="flex items-center">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{note.date} - {note.doctor}</p>
                      <p className="text-sm whitespace-pre-line">{note.content}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {/* Nursing Tab */}
              <TabsContent value="nursing" className="p-6">
                <div className="flex justify-between mb-6">
                  <h2 className="text-lg font-semibold">Enfermagem</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium mb-3">Últimos Sinais Vitais</h3>
                    {patientInfo.vitalSigns.length > 0 ? (
                      <div className="space-y-4">
                        {patientInfo.vitalSigns.map((vs, index) => (
                          <div key={index} className="p-3 bg-white border rounded-md shadow-sm">
                            <div className="flex justify-between mb-2">
                              <p className="text-sm text-muted-foreground">{vs.date}</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              <div>
                                <p className="text-xs text-muted-foreground">Temperatura</p>
                                <p className="font-medium">{vs.temperature}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Pressão Arterial</p>
                                <p className="font-medium">{vs.pressure}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Pulso</p>
                                <p className="font-medium">{vs.pulse}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Freq. Respiratória</p>
                                <p className="font-medium">{vs.respiratory}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Saturação O2</p>
                                <p className="font-medium">{vs.oxygen}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nenhum sinal vital registrado</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              {/* Clinical Records Tab */}
              <TabsContent value="clinical" className="p-6 bg-gradient-to-br from-emerald-600/10 via-teal-500/15 to-blue-600/10">
                <div className="flex justify-between mb-6">
                  <h2 className="text-lg font-semibold">Ficha Clínica</h2>
                  
                  <Button onClick={handleAddClinicalRecord}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Ficha
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <Card className="shadow-md">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-full md:w-1/3">
                          <Label htmlFor="search" className="mb-1 block">Pesquisar</Label>
                          <div className="flex items-center space-x-2">
                            <Input 
                              id="search" 
                              placeholder="Pesquisar..." 
                              value={searchClinicalRecord}
                              onChange={(e) => setSearchClinicalRecord(e.target.value)}
                              className="w-full"
                            />
                            <Button variant="outline" size="icon">
                              <Search className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="w-full md:w-1/4">
                          <Label htmlFor="startDate" className="mb-1 block">Data Inicial</Label>
                          <Input 
                            id="startDate" 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                        
                        <div className="w-full md:w-1/4">
                          <Label htmlFor="endDate" className="mb-1 block">Data Final</Label>
                          <Input 
                            id="endDate" 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                        
                        <div className="w-full md:w-1/4">
                          <Label htmlFor="speciality" className="mb-1 block">Especialidade</Label>
                          <Select 
                            value={selectedSpeciality} 
                            onValueChange={setSelectedSpeciality}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Todas</SelectItem>
                              {specialities.map((spec) => (
                                <SelectItem key={spec.id} value={spec.name}>
                                  {spec.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-md">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium">Nº</th>
                              <th className="px-4 py-3 text-left font-medium">Data</th>
                              <th className="px-4 py-3 text-left font-medium">Especialidade</th>
                              <th className="px-4 py-3 text-left font-medium">Profissional</th>
                              <th className="px-4 py-3 text-left font-medium">Tipo</th>
                              <th className="px-4 py-3 text-left font-medium">Status</th>
                              <th className="px-4 py-3 text-left font-medium">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {clinicalRecords
                              .filter(record => 
                                (searchClinicalRecord ? 
                                  record.number.includes(searchClinicalRecord) || 
                                  record.type.toLowerCase().includes(searchClinicalRecord.toLowerCase()) : true) &&
                                (selectedSpeciality ? record.speciality === selectedSpeciality : true)
                              )
                              .map((record, index) => (
                                <tr key={record.id} className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                                  <td className="px-4 py-3">{record.number}</td>
                                  <td className="px-4 py-3">{record.date}</td>
                                  <td className="px-4 py-3">{record.speciality}</td>
                                  <td className="px-4 py-3">{record.professional}</td>
                                  <td className="px-4 py-3">{record.type}</td>
                                  <td className="px-4 py-3">
                                    <Badge 
                                      variant="outline" 
                                      className={
                                        record.status === "PENDENTE" 
                                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100" 
                                          : "bg-green-100 text-green-800 hover:bg-green-100"
                                      }
                                    >
                                      {record.status}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center space-x-2">
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <ClipboardList className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PatientRecord;
