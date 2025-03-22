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
  FileSpreadsheet
} from "lucide-react";

import PatientInfoHeader from "@/components/patient-record/PatientInfoHeader";
import SummaryTab from "@/components/patient-record/tabs/SummaryTab";
import AnamnesisTab from "@/components/patient-record/tabs/AnamnesisTab";
import NursingTab from "@/components/patient-record/tabs/NursingTab";
import ClinicalRecordTab from "@/components/patient-record/tabs/ClinicalRecordTab";
import LaudoTab from "@/components/patient-record/tabs/LaudoTab";

import { 
  patientInfo, 
  availableForms, 
  clinicalRecords, 
  specialities 
} from "@/components/patient-record/PatientRecordData";

const PatientRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("summary");
  
  const handleGoBack = () => {
    navigate(-1);
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
          <PatientInfoHeader patientInfo={patientInfo} />
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
                <TabsTrigger value="laudo" className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  <FileSpreadsheet className="h-4 w-4 mr-1" />
                  Laudo
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
              
              
              <TabsContent value="summary" className="p-6">
                <SummaryTab 
                  vitalSigns={patientInfo.vitalSigns}
                  medicalNotes={patientInfo.medicalNotes}
                  prescriptions={patientInfo.prescriptions}
                  labTests={patientInfo.labTests}
                />
              </TabsContent>
              
              <TabsContent value="anamnesis" className="p-6">
                <AnamnesisTab 
                  medicalNotes={patientInfo.medicalNotes}
                  availableForms={availableForms}
                />
              </TabsContent>
              
              <TabsContent value="nursing" className="p-6">
                <NursingTab vitalSigns={patientInfo.vitalSigns} />
              </TabsContent>
              
              <TabsContent value="clinical">
                <ClinicalRecordTab 
                  clinicalRecords={clinicalRecords}
                  specialities={specialities}
                />
              </TabsContent>
              
              <TabsContent value="laudo" className="p-6">
                <LaudoTab />
              </TabsContent>
              
              
              <TabsContent value="prescription" className="p-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Prescrição</h2>
                  <p className="text-muted-foreground">Conteúdo da prescrição a ser implementado.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="laborders" className="p-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Pedidos de Exames</h2>
                  <p className="text-muted-foreground">Conteúdo de pedidos de exames a ser implementado.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="labresults" className="p-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Resultados de Exames</h2>
                  <p className="text-muted-foreground">Conteúdo de resultados de exames a ser implementado.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="discharge" className="p-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Alta/Atestado</h2>
                  <p className="text-muted-foreground">Conteúdo de alta/atestado a ser implementado.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="hospitalization" className="p-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Internação</h2>
                  <p className="text-muted-foreground">Conteúdo de internação a ser implementado.</p>
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
