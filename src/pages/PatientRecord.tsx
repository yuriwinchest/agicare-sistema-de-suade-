import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronLeft, 
  FileText, 
  Stethoscope, 
  Activity, 
  Pill, 
  FlaskConical, 
  ClipboardList, 
  UserCheck, 
  Bed,
  ClipboardIcon,
  FileSpreadsheet,
  RotateCcw,
  LogOut,
  EyeIcon,
  CheckCircle
} from "lucide-react";

import PatientInfoHeader from "@/components/patient-record/PatientInfoHeader";
import SummaryTab from "@/components/patient-record/tabs/SummaryTab";
// Removidas as importações das abas que não serão mais usadas
// import AnamnesisTab from "@/components/patient-record/tabs/AnamnesisTab";
// import NursingTab from "@/components/patient-record/tabs/NursingTab";
import ClinicalRecordTab from "@/components/patient-record/tabs/ClinicalRecordTab";
// import LaudoTab from "@/components/patient-record/tabs/LaudoTab";
import PatientDestinationDialog from "@/components/patient-record/PatientDestinationDialog";

import { 
  patientInfo, 
  availableForms, 
  clinicalRecords, 
  specialities 
} from "@/components/patient-record/PatientRecordData";

import { usePatientData } from "@/hooks/usePatientData";

/**
 * Sistema de Prontuário Eletrônico
 * 
 * Existem três tipos de prontuários no sistema:
 * 1. AGENDA - Utilizado para consultas agendadas (implementado neste arquivo)
 * 2. PRONTO ATENDIMENTO - Para atendimentos de urgência/emergência (a ser implementado)
 * 3. INTERNAÇÃO - Para pacientes internados (a ser implementado)
 * 
 * Cada prontuário tem um conjunto específico de abas e funcionalidades.
 */

// Redirection para substituir updatePatientRedirection
const updatePatientRedirection = async (patientId: string, destination: string) => {
  // Esta função será implementada quando a integração com o Supabase estiver pronta
  console.log(`Paciente ${patientId} redirecionado para ${destination}`);
  return true;
};

const PatientRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("summary");
  const [showDestinationDialog, setShowDestinationDialog] = useState(false);
  const { patientData, loading, error } = usePatientData(id);
  
  // Dados do paciente (usando dados simulados enquanto aguardamos a integração completa)
  const patient = patientData || patientInfo;
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleFinalizeConsult = () => {
    setShowDestinationDialog(true);
  };
  
  const handleCreateObservation = () => {
    // Update patient status to "Observação"
    if (id) {
      updatePatientRedirection(id, "Observação");
    }
    
    // Show toast
    toast({
      title: "Paciente em Observação",
      description: "O paciente foi colocado em observação",
    });
    
    // Navigate back to the appointment page
    navigate("/appointment");
  };

  const handleMedicationClick = () => {
    // Update patient status to "Medicação"
    if (id) {
      updatePatientRedirection(id, "Medicação");
    }
    
    // Show toast message
    toast({
      title: "Medicação",
      description: "Paciente encaminhado para medicação",
    });
    
    // Navigate back to the appointment page
    navigate("/appointment");
  };
  
  const handlePatientDischarge = () => {
    // Update patient status to "Alta"
    if (id) {
      updatePatientRedirection(id, "Alta");
    }
    
    // Show toast message
    toast({
      title: "Alta",
      description: "Paciente recebeu alta médica",
    });
    
    // Navigate back to the appointment page
    navigate("/appointment");
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="page-container">
          <div className="flex items-center justify-center h-[60vh]">
            <p>Carregando dados do paciente...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="page-container relative">
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
          <PatientInfoHeader patientInfo={patientInfo} />
        </div>
        
        <Card className="section-fade" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-0">
            <Tabs defaultValue="summary" onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b h-auto">
                <TabsTrigger value="summary" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  Resumo
                </TabsTrigger>
                <TabsTrigger value="clinical" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <ClipboardIcon className="h-4 w-4 mr-1" />
                  Ficha Clínica
                </TabsTrigger>
                <TabsTrigger value="laborders" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <FlaskConical className="h-4 w-4 mr-1" />
                  Pedidos
                </TabsTrigger>
                <TabsTrigger value="prescription" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <Pill className="h-4 w-4 mr-1" />
                  Prescrição
                </TabsTrigger>
                <TabsTrigger value="recipe" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <ClipboardList className="h-4 w-4 mr-1" />
                  Receita
                </TabsTrigger>
                <TabsTrigger value="discharge" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <UserCheck className="h-4 w-4 mr-1" />
                  Alta/Atestado
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="p-6">
                <SummaryTab 
                  vitalSigns={patientInfo.vitalSigns}
                  medicalNotes={patientInfo.medicalNotes}
                  prescriptions={patientInfo.prescriptions}
                  labTests={patientInfo.labTests}
                />
              </TabsContent>
              
              <TabsContent value="clinical">
                <ClinicalRecordTab 
                  clinicalRecords={clinicalRecords}
                  specialities={specialities}
                />
              </TabsContent>
              
              <TabsContent value="laborders" className="p-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Pedidos de Exames</h2>
                  <p className="text-muted-foreground">Conteúdo de pedidos de exames a ser implementado.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="prescription" className="p-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Prescrição</h2>
                  <p className="text-muted-foreground">Conteúdo da prescrição a ser implementado.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="recipe" className="p-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Receita</h2>
                  <p className="text-muted-foreground">Conteúdo da receita médica a ser implementado.</p>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-2">Receita para impressão</h3>
                    <div className="space-y-2">
                      <div className="border-l-4 border-teal-500 pl-3 py-1">
                        <div className="font-medium">Dipirona 500mg</div>
                        <div className="text-sm text-gray-600">1 comprimido a cada 6 horas se dor ou febre</div>
                      </div>
                      
                      <div className="border-l-4 border-teal-500 pl-3 py-1">
                        <div className="font-medium">Omeprazol 20mg</div>
                        <div className="text-sm text-gray-600">1 cápsula em jejum por 30 dias</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button size="sm" className="bg-teal-500 text-white hover:bg-teal-600">
                        Imprimir Receita
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="discharge" className="p-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Alta/Atestado</h2>
                  <p className="text-muted-foreground">Conteúdo de alta/atestado a ser implementado.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Patient destination buttons - Horizontal fixed bar on bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-center py-2 z-10">
          <div className="flex gap-2 justify-center container px-4">
            <Button 
              variant="outline" 
              onClick={handleGoBack} 
              className="flex items-center gap-1 h-auto py-2"
            >
              <RotateCcw className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium">VOLTAR</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handlePatientDischarge} 
              className="flex items-center gap-1 h-auto py-2"
            >
              <LogOut className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium">ALTA</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleMedicationClick}
              className="flex items-center gap-1 h-auto py-2"
            >
              <Pill className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium">MEDICAÇÃO</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleCreateObservation} 
              className="flex items-center gap-1 h-auto py-2"
            >
              <EyeIcon className="h-4 w-4 text-teal-600" />
              <span className="text-xs font-medium">OBSERVAÇÃO</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleFinalizeConsult} 
              className="flex items-center gap-1 h-auto py-2"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium">FINALIZAR</span>
            </Button>
          </div>
        </div>
        
        <PatientDestinationDialog 
          open={showDestinationDialog} 
          onOpenChange={setShowDestinationDialog}
          onConfirm={(destination) => {
            // Update patient status to the selected destination
            if (id) {
              updatePatientRedirection(id, destination);
            }
            
            toast({
              title: "Atendimento Finalizado",
              description: `O paciente foi encaminhado para ${destination}`,
            });
            navigate("/appointment");
          }}
        />
      </div>
    </Layout>
  );
};

export default PatientRecord;
