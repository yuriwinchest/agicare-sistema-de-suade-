import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAmbulatoryData } from "@/hooks/useAmbulatoryData";
import { PatientList } from "@/components/ambulatory/PatientList";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

const Ambulatory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("waiting");
  const { patientData, loading, error } = useAmbulatoryData();

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

  if (error) {
    return (
      <Layout>
        <div className="page-container">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Erro ao carregar dados</h2>
              <p className="text-muted-foreground">
                Ocorreu um erro ao carregar os pacientes. Por favor, tente novamente mais tarde.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="mb-8 section-fade">
          <h1 className="text-2xl font-semibold tracking-tight">ATENDIMENTOS ELETIVO</h1>
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
              
              <TabsContent value="waiting" className="mt-0">
                <PatientList
                  patients={getFilteredPatients()}
                  onCall={handleCallPatient}
                  onCancel={handleCancelPatient}
                  onAttend={handleStartConsult}
                  emptyMessage="Nenhum paciente aguardando atendimento."
                />
              </TabsContent>
              
              <TabsContent value="today" className="mt-0">
                <PatientList
                  patients={getFilteredPatients()}
                  onCall={handleCallPatient}
                  onCancel={handleCancelPatient}
                  onAttend={handleStartConsult}
                  emptyMessage="Nenhum atendimento registrado hoje."
                />
              </TabsContent>
              
              <TabsContent value="return" className="mt-0">
                <PatientList
                  patients={getFilteredPatients()}
                  onCall={handleCallPatient}
                  onCancel={handleCancelPatient}
                  onAttend={handleStartConsult}
                  variant="return"
                  emptyMessage="Nenhum retorno agendado."
                />
              </TabsContent>
              
              <TabsContent value="observation" className="mt-0">
                <PatientList
                  patients={getFilteredPatients()}
                  onCall={handleCallPatient}
                  onCancel={handleCancelPatient}
                  onAttend={handleStartConsult}
                  variant="observation"
                  emptyMessage="Nenhum paciente em observação."
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Ambulatory;
