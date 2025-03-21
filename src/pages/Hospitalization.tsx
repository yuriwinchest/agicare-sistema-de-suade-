
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, User, Stethoscope, CalendarClock, MapPin, Clock } from "lucide-react";

// Mock hospitalized patients data
const hospitalizedPatientsData = [
  { 
    id: "201", 
    name: "Gabriel Fernandes", 
    age: 45, 
    admissionDate: "15/05/2023", 
    unit: "Enfermaria", 
    bed: "E101", 
    doctor: "Dr. Paulo Menezes", 
    diagnosis: "Pneumonia" 
  },
  { 
    id: "202", 
    name: "Beatriz Almeida", 
    age: 32, 
    admissionDate: "17/05/2023", 
    unit: "UTI", 
    bed: "UTI03", 
    doctor: "Dra. Juliana Santos", 
    diagnosis: "Insuficiência Cardíaca" 
  },
  { 
    id: "203", 
    name: "Rodrigo Oliveira", 
    age: 58, 
    admissionDate: "14/05/2023", 
    unit: "Enfermaria", 
    bed: "E105", 
    doctor: "Dr. Carlos Silva", 
    diagnosis: "Diabete Descompensada" 
  },
  { 
    id: "204", 
    name: "Mariana Souza", 
    age: 28, 
    admissionDate: "18/05/2023", 
    unit: "UTI", 
    bed: "UTI07", 
    doctor: "Dr. Lucas Ferreira", 
    diagnosis: "Trauma Abdominal" 
  },
  { 
    id: "205", 
    name: "Pedro Lima", 
    age: 67, 
    admissionDate: "13/05/2023", 
    unit: "Enfermaria", 
    bed: "E110", 
    doctor: "Dra. Fernanda Costa", 
    diagnosis: "AVC Isquêmico" 
  },
];

const Hospitalization = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [unitFilter, setUnitFilter] = useState("all");
  
  const filteredPatients = hospitalizedPatientsData.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.includes(searchTerm) ||
      patient.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUnit = unitFilter === "all" || patient.unit === unitFilter;
    
    return matchesSearch && matchesUnit;
  });
  
  const handleViewPatient = (patient: any) => {
    navigate(`/patient/${patient.id}`);
  };
  
  return (
    <Layout>
      <div className="page-container">
        <div className="mb-8 section-fade">
          <h1 className="text-2xl font-semibold tracking-tight">Internação</h1>
          <p className="text-muted-foreground">Gerencie pacientes internados</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative w-full max-w-sm section-fade">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome, registro ou diagnóstico..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={unitFilter} onValueChange={setUnitFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as unidades</SelectItem>
              <SelectItem value="Enfermaria">Enfermaria</SelectItem>
              <SelectItem value="UTI">UTI</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Card className="section-fade" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Pacientes Internados ({filteredPatients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-start md:items-center">
                        <User className="h-5 w-5 mr-2 text-muted-foreground mt-0.5 md:mt-0" />
                        <div>
                          <h3 className="font-medium">{patient.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <p className="text-sm text-muted-foreground">Registro: {patient.id}</p>
                            <p className="text-sm text-muted-foreground">Idade: {patient.age} anos</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Badge variant="outline" className={
                          patient.unit === "UTI" 
                            ? "bg-red-100 text-red-800 hover:bg-red-100" 
                            : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }>
                          {patient.unit} - {patient.bed}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-medgray-100 p-3 rounded-md mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Médico Responsável</p>
                        <p className="text-sm font-medium">{patient.doctor}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Diagnóstico</p>
                        <p className="text-sm font-medium">{patient.diagnosis}</p>
                      </div>
                      <div className="flex items-center">
                        <CalendarClock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Internado desde</p>
                          <p className="text-sm font-medium">{patient.admissionDate}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end">
                      <Button
                        size="sm"
                        onClick={() => handleViewPatient(patient)}
                      >
                        <Stethoscope className="h-4 w-4 mr-1" />
                        Acessar Prontuário
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhum paciente internado encontrado para os critérios selecionados.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Hospitalization;
