
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, User, Stethoscope, CalendarClock, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Interface para os dados do paciente
interface HospitalizedPatient {
  id: string;
  name: string;
  status: string;
  medical_records?: {
    doctor?: {
      name?: string;
    };
    diagnosis?: string;
  }[];
  // Dados adicionais para internação
  unit_info?: {
    unit: string;
    bed: string;
    doctor: string;
    diagnosis: string;
    admissionDate: string;
  };
}

const Hospitalization = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [unitFilter, setUnitFilter] = useState("all");

  const { data: hospitalizedPatients = [], isLoading } = useQuery({
    queryKey: ["hospitalizedPatients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select(`
          *,
          medical_records (
            doctor:doctor_id (name),
            diagnosis
          )
        `)
        .eq("status", "Internado");

      if (error) throw error;
      
      // Transformando os dados para adicionar informações de internação (simuladas)
      return data.map((patient): HospitalizedPatient => ({
        ...patient,
        unit_info: {
          unit: patient.id.startsWith("0") ? "UTI" : "Enfermaria",
          bed: `${Math.floor(Math.random() * 10) + 1}`,
          doctor: patient.medical_records?.[0]?.doctor?.name || "Dr. Não atribuído",
          diagnosis: patient.medical_records?.[0]?.diagnosis || "Sem diagnóstico",
          admissionDate: new Date(patient.created_at).toLocaleDateString('pt-BR')
        }
      }));
    },
  });
  
  const filteredPatients = hospitalizedPatients.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.includes(searchTerm) ||
      (patient.unit_info?.doctor || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.unit_info?.diagnosis || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUnit = unitFilter === "all" || patient.unit_info?.unit === unitFilter;
    
    return matchesSearch && matchesUnit;
  });
  
  const handleViewPatient = (patient: any) => {
    navigate(`/patient/${patient.id}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="page-container">
          <div className="flex items-center justify-center h-[60vh]">
            <p>Carregando...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
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
              className="pl-8 border-teal-500/20 focus-visible:ring-teal-500/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={unitFilter} onValueChange={setUnitFilter}>
            <SelectTrigger className="w-[180px] border-teal-500/20 focus:ring-teal-500/30">
              <SelectValue placeholder="Filtrar por unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as unidades</SelectItem>
              <SelectItem value="Enfermaria">Enfermaria</SelectItem>
              <SelectItem value="UTI">UTI</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Card className="section-fade system-card" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-teal-500" />
              Pacientes Internados ({filteredPatients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow border-teal-500/10 hover:border-teal-500/30"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-start md:items-center">
                        <User className="h-5 w-5 mr-2 text-muted-foreground mt-0.5 md:mt-0" />
                        <div>
                          <h3 className="font-medium">{patient.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <p className="text-sm text-muted-foreground">Registro: {patient.id}</p>
                            <p className="text-sm text-muted-foreground">Idade: {calculateAge(patient.birth_date)} anos</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Badge variant="outline" className={
                          patient.unit_info?.unit === "UTI" 
                            ? "bg-red-100 text-red-800 hover:bg-red-100" 
                            : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }>
                          {patient.unit_info?.unit} - {patient.unit_info?.bed}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-medgray-100 p-3 rounded-md mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Médico Responsável</p>
                        <p className="text-sm font-medium">{patient.unit_info?.doctor}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Diagnóstico</p>
                        <p className="text-sm font-medium">{patient.unit_info?.diagnosis}</p>
                      </div>
                      <div className="flex items-center">
                        <CalendarClock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Internado desde</p>
                          <p className="text-sm font-medium">{patient.unit_info?.admissionDate}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end">
                      <Button
                        size="sm"
                        className="bg-teal-500 text-white hover:bg-teal-600"
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

// Função para calcular idade a partir da data de nascimento
const calculateAge = (birthDate: string | null | undefined): number => {
  if (!birthDate) return 0;
  
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export default Hospitalization;
