import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Save, ArrowRight, Thermometer, Activity, Heart, Stethoscope, CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { getPatients } from "@/services/patientService";

const NursingAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nursingTab, setNursingTab] = useState("sinais-vitais");
  const [patientData, setPatientData] = useState<any>(null);
  
  const [vitalSigns, setVitalSigns] = useState({
    temperature: "",
    pressure: "",
    pulse: "",
    respiratory: "",
    oxygen: ""
  });
  
  useEffect(() => {
    if (id) {
      const allPatients = getPatients();
      const patient = allPatients.find(p => p.id === id);
      if (patient) {
        setPatientData(patient);
      }
    }
  }, [id]);
  
  const handleVitalSignChange = (field: string, value: string) => {
    setVitalSigns(prev => ({ ...prev, [field]: value }));
  };
  
  const handleGoBack = () => {
    navigate('/nursing');
  };
  
  const handleSaveVitalSigns = () => {
    toast({
      title: "Sinais vitais salvos",
      description: "Os sinais vitais foram salvos com sucesso!"
    });
    
    navigate('/nursing');
  };
  
  const handleFinishAssessment = () => {
    toast({
      title: "Avaliação concluída",
      description: "A avaliação de enfermagem foi concluída com sucesso!"
    });
    
    navigate('/nursing');
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
          
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Paciente</h3>
                  <p className="font-semibold">{patientData.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">ID</h3>
                  <p className="font-semibold">{patientData.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Idade</h3>
                  <p className="font-semibold">{patientData.age || "38"} anos</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Data</h3>
                  <p className="font-semibold">{patientData.date || format(new Date(), 'dd/MM/yyyy')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
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
                  <div className="space-y-4">
                    <h3 className="text-md font-medium">Registrar Sinais Vitais</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="temperature">Temperatura</Label>
                        <Input 
                          id="temperature" 
                          placeholder="°C"
                          value={vitalSigns.temperature}
                          onChange={(e) => handleVitalSignChange('temperature', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pressure">Pressão Arterial</Label>
                        <Input 
                          id="pressure" 
                          placeholder="mmHg"
                          value={vitalSigns.pressure}
                          onChange={(e) => handleVitalSignChange('pressure', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pulse">Pulso</Label>
                        <Input 
                          id="pulse" 
                          placeholder="bpm"
                          value={vitalSigns.pulse}
                          onChange={(e) => handleVitalSignChange('pulse', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="respiratory">Freq. Respiratória</Label>
                        <Input 
                          id="respiratory" 
                          placeholder="irpm"
                          value={vitalSigns.respiratory}
                          onChange={(e) => handleVitalSignChange('respiratory', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="oxygen">Saturação O2</Label>
                        <Input 
                          id="oxygen" 
                          placeholder="%"
                          value={vitalSigns.oxygen}
                          onChange={(e) => handleVitalSignChange('oxygen', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button className="bg-teal-500 hover:bg-teal-600" onClick={handleSaveVitalSigns}>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Sinais Vitais
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="anamnese" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-md font-medium">Anamnese de Enfermagem</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="main-complaint">Queixa Principal</Label>
                      <Textarea 
                        id="main-complaint" 
                        placeholder="Descreva a queixa principal do paciente..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="history">História da Doença Atual</Label>
                      <Textarea 
                        id="history" 
                        placeholder="Descreva a história da doença atual..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="allergies">Alergias</Label>
                        <Input 
                          id="allergies" 
                          placeholder="Alergias conhecidas"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="medications">Medicações em Uso</Label>
                        <Input 
                          id="medications" 
                          placeholder="Medicações que o paciente utiliza"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button className="bg-teal-500 hover:bg-teal-600">
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Anamnese
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {

