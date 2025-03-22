import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
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
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Clock, User, Stethoscope, X } from "lucide-react";
import { getAmbulatoryPatients } from "@/services/patientService";

const Ambulatory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("waiting");
  const [patientData, setPatientData] = useState<any>({
    waiting: [],
    today: [],
    return: [],
    observation: []
  });
  
  useEffect(() => {
    const ambulatoryPatients = getAmbulatoryPatients();
    
    const waiting = ambulatoryPatients.filter(p => !p.status || p.status === "Aguardando");
    
    setPatientData({
      waiting,
      today: [
        ...waiting,
        { id: "005", name: "Antônio Silva", status: "Em Atendimento", time: "08:30" },
        { id: "006", name: "Fernanda Lima", status: "Finalizado", time: "08:00" },
      ],
      return: [
        { id: "007", name: "Paulo Oliveira", reason: "Retorno Ortopedia", time: "11:00" },
        { id: "008", name: "Camila Nunes", reason: "Retorno Cardiologia", time: "13:30" },
      ],
      observation: [
        { id: "009", name: "Luciana Martins", reason: "Monitoramento pressão", time: "08:45", duration: "2h" },
        { id: "010", name: "Rafael Gomes", reason: "Medicação IV", time: "09:00", duration: "1h" },
      ]
    });
  }, []);
  
  const getFilteredPatients = () => {
    const patients = patientData[activeTab as keyof typeof patientData];
    if (!searchTerm) return patients;
    
    return patients.filter((patient) => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      patient.id.includes(searchTerm)
    );
  };
  
  const handleCallPatient = (patient: any) => {
    toast({
      title: "Paciente Chamado",
      description: `${patient.name} foi chamado para atendimento`,
    });
  };
  
  const handleCancelPatient = (patient: any) => {
    toast({
      title: "Atendimento Cancelado",
      description: `O atendimento de ${patient.name} foi cancelado`,
    });
  };
  
  const handleStartConsult = (patient: any) => {
    navigate(`/patient/${patient.id}`);
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Urgente":
        return <Badge variant="destructive">Urgente</Badge>;
      case "Normal":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Normal</Badge>;
      case "Não Urgente":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Não Urgente</Badge>;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Aguardando":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Aguardando</Badge>;
      case "Em Atendimento":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Em Atendimento</Badge>;
      case "Finalizado":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Finalizado</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Layout>
      <div className="page-container">
        <div className="mb-8 section-fade">
          <h1 className="text-2xl font-semibold tracking-tight">Atendimento Ambulatorial</h1>
          <p className="text-muted-foreground">Gerencie pacientes em espera e em atendimento</p>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-sm section-fade">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome ou registro..."
              className="pl-8 border-teal-500/20 focus-visible:ring-teal-500/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Card className="section-fade system-card" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="px-6 pt-6 pb-0">
            <CardTitle>Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="waiting" onValueChange={setActiveTab}>
              <TabsList className="w-full bg-medgray-200 grid grid-cols-4 h-auto">
                <TabsTrigger value="waiting" className="data-[state=active]:bg-white data-[state=active]:text-teal-600 py-3">
                  Aguardando
                </TabsTrigger>
                <TabsTrigger value="today" className="data-[state=active]:bg-white data-[state=active]:text-teal-600 py-3">
                  Hoje
                </TabsTrigger>
                <TabsTrigger value="return" className="data-[state=active]:bg-white data-[state=active]:text-teal-600 py-3">
                  Retorno
                </TabsTrigger>
                <TabsTrigger value="observation" className="data-[state=active]:bg-white data-[state=active]:text-teal-600 py-3">
                  Observação
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="waiting" className="mt-0 space-y-4">
                {getFilteredPatients().length > 0 ? (
                  getFilteredPatients().map((patient: any) => (
                    <div 
                      key={patient.id} 
                      className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow border-teal-500/10 hover:border-teal-500/30"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <User className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <h3 className="font-medium">{patient.name}</h3>
                            <p className="text-sm text-muted-foreground">Registro: {patient.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex flex-col items-end">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{patient.time}</span>
                            </div>
                            {getPriorityBadge(patient.priority || "Normal")}
                          </div>
                        </div>
                      </div>
                      
                      {patient.triage && (
                        <div className="bg-medgray-100 p-3 rounded-md mb-4">
                          <div className="flex items-center mb-2">
                            <Stethoscope className="h-4 w-4 mr-1 text-muted-foreground" />
                            <h4 className="text-sm font-medium">Acolhimento</h4>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Temperatura</p>
                              <p className="text-sm">{patient.triage.temp}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Pressão</p>
                              <p className="text-sm">{patient.triage.pressure}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Sintomas</p>
                              <p className="text-sm">{patient.triage.symptoms}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {patient.specialty && (
                        <div className="bg-blue-50 p-3 rounded-md mb-4">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Especialidade</p>
                              <p className="text-sm">{patient.specialty}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Profissional</p>
                              <p className="text-sm">{patient.professional}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-teal-500/20 text-teal-600 hover:bg-teal-50 hover:border-teal-500/30"
                          onClick={() => handleCallPatient(patient)}
                        >
                          Chamar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleCancelPatient(patient)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Desistência
                        </Button>
                        <Button
                          size="sm"
                          className="bg-teal-500 text-white hover:bg-teal-600"
                          onClick={() => handleStartConsult(patient)}
                        >
                          <Stethoscope className="h-4 w-4 mr-1" />
                          Atender
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">Nenhum paciente aguardando atendimento.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="today" className="mt-0 space-y-4">
                {getFilteredPatients().map((patient: any) => (
                  <div 
                    key={patient.id} 
                    className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow border-teal-500/10 hover:border-teal-500/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">Registro: {patient.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{patient.time}</span>
                          </div>
                          {getStatusBadge(patient.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-2">
                      {patient.status !== "Finalizado" && (
                        <Button
                          size="sm"
                          onClick={() => handleStartConsult(patient)}
                        >
                          <Stethoscope className="h-4 w-4 mr-1" />
                          {patient.status === "Em Atendimento" ? "Continuar" : "Atender"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="return" className="mt-0 space-y-4">
                {getFilteredPatients().map((patient: any) => (
                  <div 
                    key={patient.id} 
                    className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow border-teal-500/10 hover:border-teal-500/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">Registro: {patient.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{patient.time}</span>
                          </div>
                          <Badge variant="outline">{patient.reason}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCallPatient(patient)}
                      >
                        Chamar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStartConsult(patient)}
                      >
                        <Stethoscope className="h-4 w-4 mr-1" />
                        Atender
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="observation" className="mt-0 space-y-4">
                {getFilteredPatients().map((patient: any) => (
                  <div 
                    key={patient.id} 
                    className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow border-teal-500/10 hover:border-teal-500/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">Registro: {patient.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{patient.time} ({patient.duration})</span>
                          </div>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">{patient.reason}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleStartConsult(patient)}
                      >
                        <Stethoscope className="h-4 w-4 mr-1" />
                        Avaliar
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Ambulatory;
