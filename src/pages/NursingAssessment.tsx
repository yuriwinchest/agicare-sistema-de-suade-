import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Save } from "lucide-react";
import { getPatientById } from "@/services/patientService";
import { saveVitalSigns, saveAnamnesis, completeNursingAssessment } from "@/services/nursingService";

import VitalSignsForm from "@/components/nursing/VitalSignsForm";
import AnamnesisForm from "@/components/nursing/AnamnesisForm";
import PlaceholderTab from "@/components/nursing/PlaceholderTab";
import PatientSummaryCard from "@/components/nursing/PatientSummaryCard";

const NursingAssessment = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nursingTab, setNursingTab] = useState("sinais-vitais");
  const [patientData, setPatientData] = useState<any>(null);
  
  useEffect(() => {
    if (id) {
      const allPatients = getPatientById(id);
      if (allPatients) {
        setPatientData(allPatients);
      }
    }
  }, [id]);
  
  const handleGoBack = () => {
    navigate('/nursing');
  };
  
  const handleSaveVitalSigns = (vitalSignsData: any) => {
    if (id) {
      const success = saveVitalSigns(id, vitalSignsData);
      
      if (success) {
        toast({
          title: "Sinais vitais salvos",
          description: "Os sinais vitais foram salvos com sucesso!"
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao tentar salvar os sinais vitais.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleSaveAnamnesis = (anamnesisData: any) => {
    if (id) {
      const success = saveAnamnesis(id, anamnesisData);
      
      if (success) {
        toast({
          title: "Anamnese salva",
          description: "Os dados da anamnese foram salvos com sucesso!"
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao tentar salvar a anamnese.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleFinishAssessment = () => {
    if (id) {
      const success = completeNursingAssessment(id, { name: "Enfermeiro(a)" });
      
      if (success) {
        toast({
          title: "Avaliação concluída",
          description: "A avaliação de enfermagem foi concluída com sucesso!"
        });
        
        navigate('/nursing');
      } else {
        toast({
          title: "Erro ao finalizar",
          description: "Ocorreu um erro ao tentar finalizar a avaliação.",
          variant: "destructive"
        });
      }
    }
  };
  
  if (!patientData) {
    return (
      <Layout>
        <div className="page-container">
          <div className="flex items-center justify-center h-64">
            <p>Carregando dados do paciente...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="page-container">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" onClick={handleGoBack}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Voltar
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGoBack}
              >
                Cancelar
              </Button>
              <Button 
                size="sm" 
                onClick={handleFinishAssessment}
                className="bg-teal-500 hover:bg-teal-600"
              >
                Finalizar Avaliação
              </Button>
            </div>
          </div>
          
          <PatientSummaryCard patient={patientData} />
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Avaliação de Enfermagem</h2>
              
              <Tabs value={nursingTab} onValueChange={setNursingTab} className="w-full">
                <TabsList className="grid grid-cols-7 mb-6">
                  <TabsTrigger value="sinais-vitais" className="text-xs">
                    Sinais Vitais
                  </TabsTrigger>
                  <TabsTrigger value="anamnese" className="text-xs">
                    Anamnese
                  </TabsTrigger>
                  <TabsTrigger value="exame-fisico" className="text-xs">
                    Exame Físico
                  </TabsTrigger>
                  <TabsTrigger value="balance-hidrico" className="text-xs">
                    Balanço Hídrico
                  </TabsTrigger>
                  <TabsTrigger value="evolucao" className="text-xs">
                    Evolução
                  </TabsTrigger>
                  <TabsTrigger value="procedimentos" className="text-xs">
                    Procedimentos
                  </TabsTrigger>
                  <TabsTrigger value="medicacao" className="text-xs">
                    Medicação
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="sinais-vitais" className="space-y-4">
                  <VitalSignsForm 
                    initialValues={patientData.nursingData?.vitalSigns}
                    onSave={handleSaveVitalSigns}
                  />
                </TabsContent>
                
                <TabsContent value="anamnese" className="space-y-4">
                  <AnamnesisForm 
                    initialValues={patientData.nursingData?.anamnesis}
                    onSave={handleSaveAnamnesis}
                  />
                </TabsContent>
                
                {["exame-fisico", "balance-hidrico", "evolucao", "procedimentos", "medicacao"].map((tab) => (
                  <TabsContent key={tab} value={tab} className="space-y-4">
                    <PlaceholderTab 
                      title={
                        tab === "exame-fisico" ? "Exame Físico" :
                        tab === "balance-hidrico" ? "Balanço Hídrico" :
                        tab === "evolucao" ? "Evolução de Enfermagem" :
                        tab === "procedimentos" ? "Procedimentos de Enfermagem" :
                        "Medicação"
                      }
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default NursingAssessment;
