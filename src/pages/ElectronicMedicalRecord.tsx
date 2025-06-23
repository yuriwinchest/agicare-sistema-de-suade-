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

  const getStatusBadgeClass = (status: string) => {
    if (!status) return "emr-status-badge";

    let statusClass = "emr-status-badge ";

    if (status === "Agendado") statusClass += "emr-status-agendado";
    else if (status === "Na recepção") statusClass += "emr-status-recepcao";
    else if (status === "Triagem") statusClass += "emr-status-triagem";
    else if (status === "Alta") statusClass += "emr-status-alta";
    else if (status === "Encaminhado") statusClass += "emr-status-encaminhado";

    return statusClass;
  };

  return (
    <Layout>
      <div className="emr-container">
        <div className="flex flex-col space-y-6">
          <div className="emr-header">
            <h1 className="emr-title">Prontuário Eletrônico Atendimento Ambulatorial</h1>
          </div>

          <div className="emr-filters">
            <div className="emr-filter-card">
              <div className="emr-filter-content">
                <label htmlFor="registro" className="emr-filter-label">Registro Atendimento</label>
                <Input
                  id="registro"
                  placeholder="Digite o registro"
                  className="emr-input"
                />
              </div>
            </div>

            <div className="emr-filter-card">
              <div className="emr-filter-content">
                <label htmlFor="paciente" className="emr-filter-label">Paciente</label>
                <Input
                  id="paciente"
                  placeholder="Digite o nome do paciente"
                  className="emr-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="emr-filter-card">
              <div className="emr-filter-content">
                <label htmlFor="data" className="emr-filter-label">Data de Atendimento</label>
                <div className="emr-input-icon">
                  <Input
                    id="data"
                    value={selectedDate}
                    className="emr-input"
                  />
                  <Calendar className="text-teal-500" />
                </div>
              </div>
            </div>

            <div className="emr-filter-card">
              <div className="emr-filter-content">
                <label htmlFor="especialidade" className="emr-filter-label">Especialidade</label>
                <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                  <SelectTrigger className="emr-input">
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
              </div>
            </div>
          </div>

          <div className="emr-tabs">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="emr-tabs-list">
                <TabsTrigger value="todos" className="emr-tab">Todos</TabsTrigger>
                <TabsTrigger value="agendados" className="emr-tab">Agendados</TabsTrigger>
                <TabsTrigger value="aguardando" className="emr-tab">Em Espera</TabsTrigger>
                <TabsTrigger value="finalizados" className="emr-tab">Finalizados</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                <div className="emr-table-container">
                  <Table className="emr-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Horário</TableHead>
                        <TableHead>Especialidade</TableHead>
                        <TableHead>Profissional</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                          <TableRow key={patient.id}>
                            <TableCell>{patient.name}</TableCell>
                            <TableCell>{patient.date}</TableCell>
                            <TableCell>{patient.time}</TableCell>
                            <TableCell>{patient.specialty}</TableCell>
                            <TableCell>{patient.doctor}</TableCell>
                            <TableCell>
                              <span className={`emr-status-badge ${
                                patient.status === "Agendado" ? "emr-status-agendado" :
                                patient.status === "Na recepção" ? "emr-status-recepcao" :
                                patient.status === "Triagem" ? "emr-status-triagem" :
                                patient.status === "Alta" ? "emr-status-alta" :
                                patient.status === "Encaminhado" ? "emr-status-encaminhado" : ""
                              }`}>
                                {patient.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="emr-action-button emr-action-secondary"
                                  onClick={() => handlePatientCall(patient)}
                                >
                                  <Bell size={14} />
                                  Chamar
                                </Button>
                                <Button
                                  size="sm"
                                  className="emr-action-button emr-action-primary"
                                  onClick={() => handlePatientAttend(patient)}
                                >
                                  <FileText size={14} />
                                  Atender
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                            Nenhum paciente encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ElectronicMedicalRecord;
