
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { 
  Search, 
  FileText, 
  Activity, 
  Clock, 
  Calendar,
  Thermometer,
  Heart,
  Lungs,
  Droplet,
  Edit,
  User
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getPatients } from "@/services/patientService";

const Nursing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [patients, setPatients] = useState<any[]>([]);
  
  useEffect(() => {
    // Load patients
    const loadPatients = () => {
      const allPatients = getPatients();
      // Filter patients with status "Enfermagem" or similar
      setPatients(allPatients);
    };
    
    loadPatients();
  }, []);

  // Filter patients based on search term and active tab
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      !searchTerm || 
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id?.includes(searchTerm);
    
    // Filter based on active tab
    if (activeTab === "pending") {
      return matchesSearch && (patient.status === "Enfermagem" || patient.status === "Confirmado");
    } else if (activeTab === "completed") {
      return matchesSearch && patient.status === "Avaliado";
    }
    
    return matchesSearch;
  });
  
  const handlePatientClick = (patient: any) => {
    // Navigate to the nursing assessment form for this patient
    navigate(`/nursing/assessment/${patient.id}`);
  };
  
  return (
    <Layout>
      <div className="page-container">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Avaliação de Enfermagem</h1>
          </div>

          <Card className="system-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Buscar Paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nome ou ID do paciente"
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button>Pesquisar</Button>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-900">
                <Activity className="mr-2 h-4 w-4" />
                Aguardando Enfermagem
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-900">
                <FileText className="mr-2 h-4 w-4" />
                Avaliação Concluída
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="pt-4">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Idade</TableHead>
                        <TableHead>Data / Hora</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
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
                            <TableCell>{patient.age || "38"} anos</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>{patient.date || "01/01/2023"}</span>
                                <Clock className="ml-3 mr-2 h-4 w-4 text-muted-foreground" />
                                <span>{patient.time || "10:00"}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                Aguardando
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-teal-500 border-teal-500/30"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePatientClick(patient);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Avaliar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            Nenhum paciente aguardando avaliação de enfermagem.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="completed" className="pt-4">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Idade</TableHead>
                        <TableHead>Avaliado em</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          Nenhuma avaliação concluída.
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <Thermometer className="h-5 w-5 mr-2 text-red-500" />
                  Temperatura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center py-2">36,8°C</div>
                <div className="text-xs text-gray-500 text-center">Média dos últimos pacientes</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-rose-500" />
                  Pressão Arterial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center py-2">120/80</div>
                <div className="text-xs text-gray-500 text-center">Média dos últimos pacientes</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-500" />
                  Total Pacientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center py-2">{patients.length}</div>
                <div className="text-xs text-gray-500 text-center">Atendimentos hoje</div>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </Layout>
  );
};

export default Nursing;
