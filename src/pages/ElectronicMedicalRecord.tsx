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
  Pill,
  CheckCircle2,
  UserCog,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getAllPatients } from "@/services/patientService";
import PatientActionsDialog from "@/components/electronic-record/PatientActionsDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dados simulados para diferentes grupos de status
const mockPatientGroups = {
  agendados: [
    { id: "ag001", name: "Maria Silva", date: "28/04/2023", time: "09:00", status: "Agendado", specialty: "CARDIOLOGIA", doctor: "DR. CARLOS SANTOS" },
    { id: "ag002", name: "João Pereira", date: "28/04/2023", time: "10:30", status: "Agendado", specialty: "ORTOPEDIA", doctor: "DRA. LUIZA MENDES" },
    { id: "ag003", name: "Luiza Costa", date: "28/04/2023", time: "14:00", status: "Agendado", specialty: "PEDIATRIA", doctor: "DR. ANDRÉ OLIVEIRA" }
  ],
  aguardando: [
    { id: "esp001", name: "Paulo Martins", date: "23/04/2023", time: "08:30", status: "Na recepção", specialty: "CLÍNICA GERAL", doctor: "MÉDICO PADRÃO" },
    { id: "esp002", name: "Ana Rodrigues", date: "23/04/2023", time: "09:45", status: "Triagem", specialty: "DERMATOLOGIA", doctor: "DRA. MARTA SANTOS" }
  ],
  finalizados: [
    { id: "fin001", name: "Roberto Almeida", date: "22/04/2023", time: "11:00", status: "Alta", specialty: "CARDIOLOGIA", doctor: "DR. CARLOS SANTOS" },
    { id: "fin002", name: "Carla Fernandes", date: "22/04/2023", time: "13:30", status: "Encaminhado", specialty: "CLÍNICA GERAL", doctor: "MÉDICO PADRÃO" },
    { id: "fin003", name: "Bruno Souza", date: "22/04/2023", time: "15:15", status: "Alta", specialty: "ORTOPEDIA", doctor: "DR. MAURÍCIO LIMA" },
    { id: "fin004", name: "Mariana Oliveira", date: "21/04/2023", time: "09:30", status: "Alta", specialty: "PEDIATRIA", doctor: "DRA. AMANDA COSTA" },
    { id: "fin005", name: "Leonardo Castro", date: "21/04/2023", time: "14:45", status: "Encaminhado", specialty: "NEUROLOGIA", doctor: "DR. RICARDO NEVES" }
  ]
};

const ElectronicMedicalRecord = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString('pt-BR'));
  const [doctorFilter, setDoctorFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const result = await getAllPatients();
        setPatients(result);
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
        setPatients([]);
      }
    };
    
    loadPatients();
  }, []);
  
  const getPatientsByStatus = () => {
    if (activeTab === 'agendados') return mockPatientGroups.agendados;
    if (activeTab === 'aguardando') return mockPatientGroups.aguardando;
    if (activeTab === 'finalizados') return mockPatientGroups.finalizados;
    return [...patients, ...mockPatientGroups.agendados, ...mockPatientGroups.aguardando, ...mockPatientGroups.finalizados];
  };

  const filteredPatients = getPatientsByStatus().filter((patient) => {
    // Filtro de pesquisa
    const matchesSearch = !searchTerm || 
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id?.includes(searchTerm) ||
      patient.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de médico
    const matchesDoctor = !doctorFilter || 
      patient.doctor?.toLowerCase().includes(doctorFilter.toLowerCase());
    
    // Filtro de especialidade
    const matchesSpecialty = !specialtyFilter || 
      patient.specialty === specialtyFilter;
    
    // Filtro de status (utilizado principalmente na aba "Todos")
    const matchesStatus = !statusFilter || 
      patient.status === statusFilter;
    
    return matchesSearch && matchesDoctor && matchesSpecialty && matchesStatus;
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

  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-400";
    
    if (status === "Agendado") return "bg-amber-400";
    if (status === "Na recepção") return "bg-green-500";
    if (status === "Triagem") return "bg-blue-500";
    if (status === "Alta") return "bg-teal-500";
    if (status === "Encaminhado") return "bg-purple-500";
    
    return "bg-gray-400";
  };

  const getStatusBadge = (status: string) => {
    if (!status) return null;
    
    let bgColor = "bg-gray-200 text-gray-800";
    
    if (status === "Agendado") bgColor = "bg-amber-100 text-amber-800";
    if (status === "Na recepção") bgColor = "bg-green-100 text-green-800";
    if (status === "Triagem") bgColor = "bg-blue-100 text-blue-800";
    if (status === "Alta") bgColor = "bg-teal-100 text-teal-800";
    if (status === "Encaminhado") bgColor = "bg-purple-100 text-purple-800";
    
    return (
      <Badge className={`${bgColor} font-medium`}>
        {status}
      </Badge>
    );
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
              <Card className="w-full md:w-60">
                <CardContent className="p-4">
                  <label htmlFor="registro" className="text-sm text-gray-500 mb-1 block">Registro Atendimento</label>
                  <Input 
                    id="registro" 
                    placeholder="Digite o registro"
                    className="border-teal-500/20"
                  />
                </CardContent>
              </Card>
              
              <Card className="w-full md:w-60">
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
              
              <Card className="w-full md:w-60">
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

              <Card className="w-full md:w-60">
                <CardContent className="p-4">
                  <label htmlFor="especialidade" className="text-sm text-gray-500 mb-1 block">Especialidade</label>
                  <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                    <SelectTrigger className="border-teal-500/20">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      <SelectItem value="CARDIOLOGIA">Cardiologia</SelectItem>
                      <SelectItem value="CLÍNICA GERAL">Clínica Geral</SelectItem>
                      <SelectItem value="ORTOPEDIA">Ortopedia</SelectItem>
                      <SelectItem value="PEDIATRIA">Pediatria</SelectItem>
                      <SelectItem value="DERMATOLOGIA">Dermatologia</SelectItem>
                      <SelectItem value="NEUROLOGIA">Neurologia</SelectItem>
                    </SelectContent>
                  </Select>
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
              
              <div className={`bg-amber-500 text-white px-6 py-3 text-center font-medium border-r ${activeTab === "agendados" ? "bg-amber-600" : ""}`}>
                <button 
                  className="flex items-center justify-center w-full" 
                  onClick={() => setActiveTab("agendados")}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  <div className="flex items-center gap-2">
                    <span>PACIENTES AGENDADOS</span>
                    <Badge className="bg-white text-amber-600">{mockPatientGroups.agendados.length}</Badge>
                  </div>
                </button>
              </div>
              
              <div className={`bg-green-600 text-white px-6 py-3 text-center font-medium border-r ${activeTab === "aguardando" ? "bg-green-700" : ""}`}>
                <button 
                  className="flex items-center justify-center w-full" 
                  onClick={() => setActiveTab("aguardando")}
                >
                  <Clock className="h-5 w-5 mr-2" />
                  <div className="flex items-center gap-2">
                    <span>AGUARDANDO ATENDIMENTO</span>
                    <Badge className="bg-white text-green-700">{mockPatientGroups.aguardando.length}</Badge>
                  </div>
                </button>
              </div>
              
              <div className={`bg-blue-600 text-white px-6 py-3 text-center font-medium ${activeTab === "finalizados" ? "bg-blue-700" : ""}`}>
                <button 
                  className="flex items-center justify-center w-full" 
                  onClick={() => setActiveTab("finalizados")}
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <div className="flex items-center gap-2">
                    <span>ATENDIMENTOS FINALIZADOS</span>
                    <Badge className="bg-white text-blue-700">{mockPatientGroups.finalizados.length}</Badge>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="p-2 bg-gray-50 border-b flex items-center justify-between">
              <div className="flex items-center text-xs text-red-500">
                <Bell className="h-4 w-4 mr-1" />
                <span>Mensagens do Sistema: {filteredPatients.length} paciente(s) disponíveis para visualização.</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-7 text-xs border-gray-300 w-40">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
                    <SelectItem value="Agendado">Agendado</SelectItem>
                    <SelectItem value="Na recepção">Na recepção</SelectItem>
                    <SelectItem value="Triagem">Triagem</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Encaminhado">Encaminhado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="w-16 text-center">Seleção</TableHead>
                    <TableHead className="w-16 text-center">Status</TableHead>
                    <TableHead className="text-center">Guia de Prontuário</TableHead>
                    <TableHead className="text-center">Registro / Ident.</TableHead>
                    <TableHead className="text-center">Data / Hora</TableHead>
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
                              <div className={`w-5 h-5 ${getStatusColor(patient.status)} rounded-sm`}></div>
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
                              <div className="mt-1">
                                {getStatusBadge(patient.status)}
                              </div>
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
