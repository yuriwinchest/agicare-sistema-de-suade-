import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, User, Stethoscope, CalendarClock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      return data;
    },
  });
  
  const filteredPatients = hospitalizedPatients.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.includes(searchTerm) ||
      (patient.medical_records?.[0]?.doctor?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.medical_records?.[0]?.diagnosis || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUnit = unitFilter === "all" || patient.unit === unitFilter;
    
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

export default Hospitalization;
