import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, ArrowRight, ChevronsRight, AlertCircle, FileText, ChevronLeft, LogOut, Pill, Eye, CheckCircle } from "lucide-react";
import { getPatientById } from "@/services/patientService";
import { useToast } from "@/hooks/use-toast";

// Status do fluxo de atendimento
enum FlowStatus {
  WAITING = "waiting",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  NOT_STARTED = "not_started",
}

// Define cada etapa do fluxo de atendimento
const flowSteps = [
  { id: "reception", label: "Recepção", icon: Clock },
  { id: "doctor", label: "Consultório Médico", icon: FileText },
  { id: "exams", label: "Exames/Laboratório", icon: AlertCircle },
  { id: "return", label: "Retorno Médico", icon: ChevronsRight },
  { id: "checkout", label: "Saída/Alta", icon: Check },
];

const PatientFlow = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patient, setPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Estado de cada etapa no fluxo de atendimento
  const [flowState, setFlowState] = useState({
    reception: FlowStatus.COMPLETED,
    doctor: FlowStatus.IN_PROGRESS,
    exams: FlowStatus.NOT_STARTED,
    return: FlowStatus.NOT_STARTED,
    checkout: FlowStatus.NOT_STARTED,
  });

  // Dados do atendimento atual
  const [currentVisit, setCurrentVisit] = useState({
    id: "visit_123",
    startTime: new Date(),
    professional: "Dr. Ricardo Mendes",
    specialty: "Cardiologia",
    status: "EM ATENDIMENTO",
    location: "Consultório 3",
    paymentStatus: "AGUARDANDO",
    paymentMethod: "Plano de Saúde",
    healthPlan: "UNIMED",
    notes: "Paciente com queixa de dor no peito. Histórico de hipertensão.",
    prescription: "",
    exams: [],
    medicalRecord: "",
  });

  useEffect(() => {
    const loadPatient = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const patientData = await getPatientById(id);
          if (!patientData) {
            toast({
              title: "Paciente não encontrado",
              description: "Não foi possível encontrar os dados do paciente.",
              variant: "destructive",
            });
            navigate("/reception");
          } else {
            setPatient(patientData);
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

  // Avança para a próxima etapa do fluxo
  const advanceToNextStep = (currentStep: string) => {
    const stepIndex = flowSteps.findIndex(step => step.id === currentStep);
    
    if (stepIndex < flowSteps.length - 1) {
      const nextStep = flowSteps[stepIndex + 1].id;
      
      setFlowState(prev => ({
        ...prev,
        [currentStep]: FlowStatus.COMPLETED,
        [nextStep]: FlowStatus.IN_PROGRESS
      }));
    } else {
      // Se for a última etapa, apenas marca como concluída
      setFlowState(prev => ({
        ...prev,
        [currentStep]: FlowStatus.COMPLETED,
      }));
      
      // Atualizar o status do atendimento para "FINALIZADO"
      setCurrentVisit(prev => ({
        ...prev,
        status: "FINALIZADO"
      }));
    }
  };

  // Obtém o nome do status para exibição
  const getStatusName = (status: FlowStatus) => {
    switch (status) {
      case FlowStatus.WAITING:
        return "Aguardando";
      case FlowStatus.IN_PROGRESS:
        return "Em andamento";
      case FlowStatus.COMPLETED:
        return "Concluído";
      case FlowStatus.NOT_STARTED:
        return "Não iniciado";
      default:
        return "Desconhecido";
    }
  };

  // Obtém a cor da badge com base no status
  const getStatusColor = (status: FlowStatus) => {
    switch (status) {
      case FlowStatus.WAITING:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case FlowStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case FlowStatus.COMPLETED:
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case FlowStatus.NOT_STARTED:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleBackToReception = () => {
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
            onClick={handleBackToReception}
            className="flex items-center gap-2 border-teal-500/20 text-teal-600 hover:bg-teal-50 hover:border-teal-500/30"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar para Recepção
          </Button>
          <h1 className="text-xl font-semibold text-teal-700">Fluxo de Atendimento</h1>
        </div>

        {patient && (
          <Card className="mb-6 border-teal-100 overflow-hidden">
            <CardHeader className="bg-teal-50/50 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-teal-800">{patient.name}</CardTitle>
                <Badge variant="outline" className="border-teal-200 text-teal-700">
                  {currentVisit.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Prontuário</p>
                  <p className="font-medium">{patient.registrationNumber || '0001254987'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data de Nascimento</p>
                  <p className="font-medium">{patient.dateOfBirth || '15/04/1982'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Convênio</p>
                  <p className="font-medium">{currentVisit.healthPlan || 'Particular'}</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Especialidade</p>
                  <p className="font-medium">{currentVisit.specialty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Médico</p>
                  <p className="font-medium">{currentVisit.professional}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Local</p>
                  <p className="font-medium">{currentVisit.location}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-700 mb-2">Fluxo de Atendimento</h3>
                  <div className="flex flex-wrap gap-2">
                    {flowSteps.map((step, index) => (
                      <React.Fragment key={step.id}>
                        <div className="flex items-center">
                          <Badge 
                            className={`${getStatusColor(flowState[step.id as keyof typeof flowState])} font-normal cursor-pointer`}
                            onClick={() => setActiveTab(step.id)}
                          >
                            <step.icon className="h-3 w-3 mr-1" />
                            {step.label}
                          </Badge>
                          <span className="text-gray-500">
                            {getStatusName(flowState[step.id as keyof typeof flowState])}
                          </span>
                        </div>
                        {index < flowSteps.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-gray-300 mx-1" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-20">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            {flowSteps.map((step) => (
              <TabsTrigger key={step.id} value={step.id}>{step.label}</TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Visão Geral do Atendimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Queixa Principal</h3>
                    <p>{currentVisit.notes || "Nenhuma informação registrada."}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Status do Pagamento</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={currentVisit.paymentStatus === "PAGO" ? "success" : "outline"}>
                        {currentVisit.paymentStatus}
                      </Badge>
                      <span className="text-gray-600">via {currentVisit.paymentMethod}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Etapa Atual</h3>
                    {Object.entries(flowState).map(([stepId, status]) => {
                      if (status === FlowStatus.IN_PROGRESS) {
                        const step = flowSteps.find((s) => s.id === stepId);
                        return (
                          <div key={stepId} className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              {step?.label || stepId}
                            </Badge>
                            <span className="text-gray-600">Em andamento</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reception">
            <Card>
              <CardHeader>
                <CardTitle>Recepção</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Dados do Atendimento</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">Tipo de Atendimento:</p>
                        <p>Consulta</p>
                        <p className="text-sm text-gray-500">Especialidade:</p>
                        <p>{currentVisit.specialty}</p>
                        <p className="text-sm text-gray-500">Profissional:</p>
                        <p>{currentVisit.professional}</p>
                        <p className="text-sm text-gray-500">Local de Origem:</p>
                        <p>Próprio Paciente</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Dados de Pagamento</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">Forma de Pagamento:</p>
                        <p>{currentVisit.paymentMethod}</p>
                        <p className="text-sm text-gray-500">Convênio:</p>
                        <p>{currentVisit.healthPlan}</p>
                        <p className="text-sm text-gray-500">Status:</p>
                        <p>{currentVisit.paymentStatus}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    {flowState.reception === FlowStatus.IN_PROGRESS && (
                      <Button 
                        onClick={() => advanceToNextStep("reception")}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        Confirmar Recepção e Avançar
                      </Button>
                    )}
                    {flowState.reception === FlowStatus.COMPLETED && (
                      <Badge className="bg-green-100 text-green-800 px-3 py-1">
                        <Check className="h-4 w-4 mr-1" />
                        Recepção Concluída
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="doctor">
            <Card>
              <CardHeader>
                <CardTitle>Consultório Médico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Prontuário</h3>
                    <textarea 
                      className="w-full min-h-32 p-2 border border-gray-300 rounded-md"
                      placeholder="Registre aqui as informações do atendimento médico..."
                      value={currentVisit.medicalRecord}
                      onChange={(e) => setCurrentVisit(prev => ({
                        ...prev,
                        medicalRecord: e.target.value
                      }))}
                      disabled={flowState.doctor !== FlowStatus.IN_PROGRESS}
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Solicitar Exames</h3>
                    <div className="flex gap-2 flex-wrap">
                      {["Hemograma", "Raio-X", "Eletrocardiograma", "Ultrassonografia"].map((exam) => (
                        <Badge 
                          key={exam} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-teal-50"
                          onClick={() => setCurrentVisit(prev => ({
                            ...prev,
                            exams: [...prev.exams, exam]
                          }))}
                        >
                          {exam}
                        </Badge>
                      ))}
                    </div>
                    
                    {currentVisit.exams.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-700">Exames Solicitados:</h4>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {currentVisit.exams.map((exam: string, index: number) => (
                            <Badge key={index} className="bg-blue-100 text-blue-800">
                              {exam}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Prescrição</h3>
                    <textarea 
                      className="w-full min-h-32 p-2 border border-gray-300 rounded-md"
                      placeholder="Registre aqui a prescrição médica..."
                      value={currentVisit.prescription}
                      onChange={(e) => setCurrentVisit(prev => ({
                        ...prev,
                        prescription: e.target.value
                      }))}
                      disabled={flowState.doctor !== FlowStatus.IN_PROGRESS}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    {flowState.doctor === FlowStatus.IN_PROGRESS && currentVisit.exams.length > 0 && (
                      <Button 
                        onClick={() => advanceToNextStep("doctor")}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        Encaminhar para Exames
                      </Button>
                    )}
                    {flowState.doctor === FlowStatus.IN_PROGRESS && currentVisit.exams.length === 0 && (
                      <Button 
                        onClick={() => {
                          // Se não há exames, pular direto para a saída
                          setFlowState(prev => ({
                            ...prev,
                            doctor: FlowStatus.COMPLETED,
                            exams: FlowStatus.NOT_STARTED,
                            return: FlowStatus.NOT_STARTED,
                            checkout: FlowStatus.IN_PROGRESS
                          }));
                        }}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        Finalizar Consulta (Sem Exames)
                      </Button>
                    )}
                    {flowState.doctor === FlowStatus.COMPLETED && (
                      <Badge className="bg-green-100 text-green-800 px-3 py-1">
                        <Check className="h-4 w-4 mr-1" />
                        Consulta Médica Concluída
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="exams">
            <Card>
              <CardHeader>
                <CardTitle>Exames e Laboratório</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Exames Solicitados</h3>
                    {currentVisit.exams.length > 0 ? (
                      <div className="space-y-4">
                        {currentVisit.exams.map((exam: string, index: number) => (
                          <div key={index} className="p-3 border border-gray-200 rounded-md">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">{exam}</h4>
                              {flowState.exams === FlowStatus.IN_PROGRESS && (
                                <Badge variant="outline" className="cursor-pointer hover:bg-green-50">
                                  Marcar como Realizado
                                </Badge>
                              )}
                            </div>
                            <textarea
                              className="w-full mt-2 min-h-20 p-2 border border-gray-300 rounded-md"
                              placeholder="Resultado do exame..."
                              disabled={flowState.exams !== FlowStatus.IN_PROGRESS}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Nenhum exame solicitado para este paciente.</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    {flowState.exams === FlowStatus.IN_PROGRESS && (
                      <Button 
                        onClick={() => advanceToNextStep("exams")}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        Finalizar Exames e Retornar ao Médico
                      </Button>
                    )}
                    {flowState.exams === FlowStatus.COMPLETED && (
                      <Badge className="bg-green-100 text-green-800 px-3 py-1">
                        <Check className="h-4 w-4 mr-1" />
                        Exames Concluídos
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="return">
            <Card>
              <CardHeader>
                <CardTitle>Retorno ao Médico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Avaliação de Resultados</h3>
                    <textarea 
                      className="w-full min-h-32 p-2 border border-gray-300 rounded-md"
                      placeholder="Registre aqui a avaliação dos resultados dos exames..."
                      disabled={flowState.return !== FlowStatus.IN_PROGRESS}
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Prescrição Final</h3>
                    <textarea 
                      className="w-full min-h-32 p-2 border border-gray-300 rounded-md"
                      placeholder="Registre aqui a prescrição médica final..."
                      value={currentVisit.prescription}
                      onChange={(e) => setCurrentVisit(prev => ({
                        ...prev,
                        prescription: e.target.value
                      }))}
                      disabled={flowState.return !== FlowStatus.IN_PROGRESS}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    {flowState.return === FlowStatus.IN_PROGRESS && (
                      <Button 
                        onClick={() => advanceToNextStep("return")}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        Finalizar Retorno e Dar Alta
                      </Button>
                    )}
                    {flowState.return === FlowStatus.COMPLETED && (
                      <Badge className="bg-green-100 text-green-800 px-3 py-1">
                        <Check className="h-4 w-4 mr-1" />
                        Retorno Concluído
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="checkout">
            <Card>
              <CardHeader>
                <CardTitle>Saída/Alta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Resumo do Atendimento</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">Hora de Entrada:</p>
                        <p>{currentVisit.startTime.toLocaleTimeString()}</p>
                        <p className="text-sm text-gray-500">Especialidade:</p>
                        <p>{currentVisit.specialty}</p>
                        <p className="text-sm text-gray-500">Profissional:</p>
                        <p>{currentVisit.professional}</p>
                        <p className="text-sm text-gray-500">Status:</p>
                        <p>{currentVisit.status}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Pagamento</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">Forma de Pagamento:</p>
                        <p>{currentVisit.paymentMethod}</p>
                        <p className="text-sm text-gray-500">Status:</p>
                        <p>{currentVisit.paymentStatus}</p>
                        <p className="text-sm text-gray-500">Valor:</p>
                        <p>R$ 120,00</p>
                      </div>
                      
                      {flowState.checkout === FlowStatus.IN_PROGRESS && currentVisit.paymentStatus !== "PAGO" && (
                        <Button 
                          className="mt-4 bg-green-600 hover:bg-green-700"
                          onClick={() => setCurrentVisit(prev => ({
                            ...prev,
                            paymentStatus: "PAGO"
                          }))}
                        >
                          Confirmar Pagamento
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Documentos para o Paciente</h3>
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" className="text-teal-600 border-teal-200 hover:bg-teal-50">
                        Imprimir Receita
                      </Button>
                      <Button variant="outline" className="text-teal-600 border-teal-200 hover:bg-teal-50">
                        Imprimir Atestado
                      </Button>
                      <Button variant="outline" className="text-teal-600 border-teal-200 hover:bg-teal-50">
                        Imprimir Resultado Exames
                      </Button>
                      <Button variant="outline" className="text-teal-600 border-teal-200 hover:bg-teal-50">
                        Imprimir Recibo
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    {flowState.checkout === FlowStatus.IN_PROGRESS && currentVisit.paymentStatus === "PAGO" && (
                      <Button 
                        onClick={() => advanceToNextStep("checkout")}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        Finalizar Atendimento
                      </Button>
                    )}
                    {flowState.checkout === FlowStatus.COMPLETED && (
                      <Badge className="bg-green-100 text-green-800 px-3 py-1">
                        <Check className="h-4 w-4 mr-1" />
                        Atendimento Finalizado
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Barra horizontal fixa com botões de ação */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-center py-2 z-10">
          <div className="flex gap-2 justify-center container px-4">
            <Button 
              variant="outline" 
              onClick={handleBackToReception} 
              className="flex items-center gap-1 h-auto py-2"
            >
              <ChevronLeft className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium">VOLTAR</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-1 h-auto py-2"
              onClick={() => {
                if (flowState.checkout === FlowStatus.IN_PROGRESS) {
                  advanceToNextStep("checkout");
                  toast({
                    title: "Alta confirmada",
                    description: "O paciente recebeu alta",
                  });
                }
              }}
            >
              <LogOut className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium">ALTA</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-1 h-auto py-2"
              onClick={() => {
                toast({
                  title: "Medicação",
                  description: "Paciente encaminhado para medicação",
                });
              }}
            >
              <Pill className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium">MEDICAÇÃO</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-1 h-auto py-2"
              onClick={() => {
                toast({
                  title: "Observação",
                  description: "Paciente encaminhado para observação",
                });
              }}
            >
              <Eye className="h-4 w-4 text-teal-600" />
              <span className="text-xs font-medium">OBSERVAÇÃO</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-1 h-auto py-2"
              onClick={() => {
                if (currentVisit.status !== "FINALIZADO") {
                  setCurrentVisit(prev => ({
                    ...prev,
                    status: "FINALIZADO"
                  }));
                  toast({
                    title: "Atendimento finalizado",
                    description: "O paciente foi finalizado com sucesso",
                  });
                }
              }}
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium">FINALIZAR</span>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientFlow; 