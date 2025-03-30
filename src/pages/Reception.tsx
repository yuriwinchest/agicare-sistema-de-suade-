
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  UserPlus, 
  Phone, 
  Calendar, 
  Clock, 
  User, 
  Building, 
  CheckCircle2, 
  AlertCircle
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getPatients } from "@/services/patientService";

const Reception = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [receptionFilter, setReceptionFilter] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  
  // Load patients when component mounts
  useEffect(() => {
    const loadPatientList = async () => {
      try {
        const patientsData = await getPatients();
        setPatients(patientsData);
      } catch (error) {
        console.error("Error loading patients:", error);
        setPatients([]);
      }
    };
    
    // Initial load
    loadPatientList();
    
    // Refresh list when component becomes visible after navigation
    window.addEventListener('focus', loadPatientList);
    
    // Cleanup
    return () => {
      window.removeEventListener('focus', loadPatientList);
    };
  }, []);
  
  // Filter patients based on search term and filters
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cpf?.includes(searchTerm);
    
    const matchesStatus = statusFilter ? patient.status === statusFilter : true;
    const matchesReception = receptionFilter ? patient.reception === receptionFilter : true;
    
    return matchesSearch && matchesStatus && matchesReception;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Agendado":
        return "status-waiting";
      case "Confirmado":
        return "status-in-progress";
      case "Aguardando":
        return "status-critical";
      case "Atendido":
        return "status-completed";
      default:
        return "status-waiting";
    }
  };

  // Navigate to patient reception confirmation page when clicking on a patient
  const handlePatientClick = (patient: any) => {
    navigate(`/patient-reception/${patient.id}`);
  };

  // Handle patient check-in button click
  const handleCheckIn = (patient: any) => {
    navigate(`/patient-reception/${patient.id}`);
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Controle de Atendimento Ambulatorial</h1>
            <Button 
              variant="teal" 
              className="flex items-center gap-2" 
              onClick={() => navigate("/patient-registration")}
            >
              <UserPlus size={18} />
              Cadastrar Paciente
            </Button>
          </div>

          <Card className="system-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-search">Paciente / CPF</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="patient-search"
                      placeholder="Buscar por nome ou CPF"
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reception-filter">Recepção</Label>
                  <Select value={receptionFilter} onValueChange={setReceptionFilter}>
                    <SelectTrigger id="reception-filter">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      <SelectItem value="RECEPÇÃO CENTRAL">RECEPÇÃO CENTRAL</SelectItem>
                      <SelectItem value="RECEPÇÃO PEDIATRIA">RECEPÇÃO PEDIATRIA</SelectItem>
                      <SelectItem value="RECEPÇÃO ORTOPEDIA">RECEPÇÃO ORTOPEDIA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="Agendado">Agendado</SelectItem>
                      <SelectItem value="Confirmado">Confirmado</SelectItem>
                      <SelectItem value="Aguardando">Aguardando</SelectItem>
                      <SelectItem value="Atendido">Atendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="system-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Protocolo</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Recepção</TableHead>
                      <TableHead>Data / Hora</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow 
                        key={patient.id} 
                        className="cursor-pointer hover:bg-teal-50/50"
                        onClick={() => handlePatientClick(patient)}
                      >
                        <TableCell className="font-medium">{patient.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{patient.name}</span>
                            <span className="text-xs text-muted-foreground">{patient.cpf}</span>
                          </div>
                        </TableCell>
                        <TableCell>{patient.reception}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{patient.date}</span>
                            <Clock className="ml-3 mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{patient.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{patient.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`${getStatusClass(patient.status)}`}>
                            {patient.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="teal-hover"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/patient/${patient.id}`);
                              }}
                            >
                              <User className="h-4 w-4" />
                              <span className="sr-only">Ver paciente</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="teal-hover"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCheckIn(patient);
                              }}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="sr-only">Check-in</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="system-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center gap-2">
                  <Building className="h-5 w-5 text-teal-500" />
                  Recepções
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" className="justify-start font-normal h-auto py-2">
                    <div className="flex justify-between items-center w-full">
                      <span>Recepção Central</span>
                      <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">18</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start font-normal h-auto py-2">
                    <div className="flex justify-between items-center w-full">
                      <span>Recepção Pediatria</span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">7</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start font-normal h-auto py-2">
                    <div className="flex justify-between items-center w-full">
                      <span>Recepção Ortopedia</span>
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">12</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="system-card md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Alertas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
                    <div className="font-medium">Pacientes aguardando há mais de 30 minutos: 3</div>
                    <div className="text-xs mt-1">Verifique os pacientes com status de espera prolongada</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
                    <div className="font-medium">Confirmações pendentes: 5</div>
                    <div className="text-xs mt-1">Pacientes com consultas amanhã que ainda não confirmaram</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reception;

