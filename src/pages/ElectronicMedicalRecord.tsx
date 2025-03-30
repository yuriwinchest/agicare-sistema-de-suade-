import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { 
  Search, 
  Calendar, 
  Clock, 
  FileText, 
  Activity,
  Bell,
  Pill
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getPatients } from "@/services/patientService";
import PatientActionsDialog from "@/components/electronic-record/PatientActionsDialog";

const ElectronicMedicalRecord = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString('pt-BR'));
  
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const result = await getPatients();
        setPatients(result);
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
        setPatients([]);
      }
    };
    
    loadPatients();
  }, []);
  
  const filteredPatients = patients.filter((patient) => {
    if (!searchTerm) return true;
    
    return (
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cpf?.includes(searchTerm) ||
      patient.id?.includes(searchTerm)
    );
  });

  const handlePatientCall = (patient: any) => {
    toast({
      title: "Paciente Chamado",
      description: `${patient.name} foi chamado para atendimento`,
    });
  };

  const handlePatientAttend = (patient: any) => {
    navigate(`/patient/${patient.id}`);
  };

  const getStatusColor = (id: string) => {
    const lastDigit = parseInt(id.charAt(id.length - 1));
    
    if (lastDigit % 3 === 0) return "bg-yellow-400";
    if (lastDigit % 3 === 1) return "bg-red-500";
    return "bg-blue-500";
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Prontuário Eletrônico Atendimento Ambulatorial</h1>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="w-full md:w-80">
                <CardContent className="p-4">
                  <label htmlFor="registro" className="text-sm text-gray-500 mb-1 block">Registro Atendimento</label>
                  <Input 
                    id="registro" 
                    placeholder="Digite o registro"
                    className="border-teal-500/20"
                  />
                </CardContent>
              </Card>
              
              <Card className="w-full md:w-80">
                <CardContent className="p-4">
                  <label htmlFor="paciente" className="text-sm text-gray-500 mb-1 block">Paciente</label>
                  <Input 
                    id="paciente" 
                    placeholder="Digite o nome do paciente"
                    className="border-teal-500/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </CardContent>
              </Card>
              
              <Card className="w-full md:w-80">
                <CardContent className="p-4">
                  <label htmlFor="data" className="text-sm text-gray-500 mb-1 block">Data de Atendimento</label>
                  <div className="relative">
                    <Input 
                      id="data" 
                      value={selectedDate}
                      className="border-teal-500/20 pl-9"
                    />
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-teal-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Button className="h-10 px-4 py-2 bg-teal-500 text-white hover:bg-teal-600 self-end">
              <Search className="h-4 w-4 mr-2" />
              PESQUISAR
            </Button>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 p-0 border-b">
              <div className={`bg-white px-6 py-3 text-center font-medium border-r transition-colors ${activeTab === "todos" ? "bg-blue-50 text-blue-600 border-b-2 border-b-blue-500" : ""}`}>
                <button 
                  className="flex items-center justify-center w-full" 
                  onClick={() => setActiveTab("todos")}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  <span>TODOS</span>
                </button>
              </div>
              
              <div className={`bg-green-600 text-white px-6 py-3 text-center font-medium border-r ${activeTab === "atendimento" ? "bg-green-700" : ""}`}>
                <button 
                  className="flex items-center justify-center w-full" 
                  onClick={() => setActiveTab("atendimento")}
                >
                  <Activity className="h-5 w-5 mr-2" />
                  <div className="flex items-center gap-2">
                    <span>AGUARDANDO ATENDIMENTO</span>
                    <Badge className="bg-white text-green-700">1</Badge>
                  </div>
                </button>
              </div>
              
              <div className={`bg-teal-600 text-white px-6 py-3 text-center font-medium border-r ${activeTab === "realizacao" ? "bg-teal-700" : ""}`}>
                <button 
                  className="flex items-center justify-center w-full" 
                  onClick={() => setActiveTab("realizacao")}
                >
                  <Activity className="h-5 w-5 mr-2" />
                  <div className="flex items-center gap-2">
                    <span>AGUARDANDO REALIZAÇÃO</span>
                    <Badge className="bg-white text-teal-700">0</Badge>
                  </div>
                </button>
              </div>
              
              <div className="grid grid-cols-2 p-0">
                <div className={`bg-blue-600 text-white px-6 py-3 text-center font-medium border-r ${activeTab === "observacao" ? "bg-blue-700" : ""}`}>
                  <button 
                    className="flex items-center justify-center w-full" 
                    onClick={() => setActiveTab("observacao")}
                  >
                    <Bell className="h-5 w-5 mr-2" />
                    <div className="flex items-center gap-2">
                      <span>EM OBSERVAÇÃO</span>
                      <Badge className="bg-white text-blue-700">2</Badge>
                    </div>
                  </button>
                </div>
                
                <div className={`bg-purple-600 text-white px-6 py-3 text-center font-medium ${activeTab === "medicacao" ? "bg-purple-700" : ""}`}>
                  <button 
                    className="flex items-center justify-center w-full" 
                    onClick={() => setActiveTab("medicacao")}
                  >
                    <Pill className="h-5 w-5 mr-2" />
                    <div className="flex items-center gap-2">
                      <span>MEDICAÇÃO</span>
                      <Badge className="bg-white text-purple-700">2</Badge>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-2 bg-gray-50 border-b flex items-center">
              <div className="flex items-center text-xs text-red-500">
                <Bell className="h-4 w-4 mr-1" />
                <span>Mensagens do Sistema: Pacientes e menos no local de atendimento.</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="w-16 text-center">Seleção</TableHead>
                    <TableHead className="w-16 text-center">Prioridade</TableHead>
                    <TableHead className="text-center">Guia de Prontuário</TableHead>
                    <TableHead className="text-center">Registro / Ident.</TableHead>
                    <TableHead className="text-center">Data / Classificação</TableHead>
                    <TableHead className="text-center">Senha Espera</TableHead>
                    <TableHead className="text-center">Paciente</TableHead>
                    <TableHead className="text-center">Médico Principal</TableHead>
                    <TableHead className="text-center">Especialidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <PatientActionsDialog
                        key={patient.id}
                        patientId={patient.id}
                        onCall={() => handlePatientCall(patient)}
                        onAttend={() => handlePatientAttend(patient)}
                      >
                        <TableRow 
                          className="cursor-pointer hover:bg-blue-50/50"
                        >
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <div className="w-6 h-6 bg-blue-500 rounded-sm"></div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <div className={`w-5 h-5 ${getStatusColor(patient.id)} rounded-sm`}></div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-medium">{`${Math.floor(Math.random() * 9000) + 1000}`}</TableCell>
                          <TableCell className="text-center">{patient.id}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center">
                              <span>{patient.date || "03/03/2023"}</span>
                              <span className="text-xs text-gray-500">{patient.time || "14:30"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{`S-${Math.floor(Math.random() * 900) + 100}`}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{patient.name}</span>
                              <span className="text-xs text-gray-500">{patient.age || Math.floor(Math.random() * 50) + 18} ANOS</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span>{patient.doctor || "MÉDICO PADRÃO"}</span>
                          </TableCell>
                          <TableCell>
                            <span>{patient.specialty || "CLÍNICA GERAL"}</span>
                          </TableCell>
                        </TableRow>
                      </PatientActionsDialog>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                        Nenhum registro encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ElectronicMedicalRecord;
