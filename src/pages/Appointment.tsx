import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, Clock, User, Stethoscope, X, CalendarCheck } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { getActiveAppointments } from "@/services/patientService";

const Appointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [patients, setPatients] = useState<any[]>([]);
  
  useEffect(() => {
    const loadAppointments = () => {
      const activeAppointments = getActiveAppointments();
      setPatients(activeAppointments);
    };
    
    loadAppointments();
    
    window.addEventListener('focus', loadAppointments);
    
    return () => {
      window.removeEventListener('focus', loadAppointments);
    };
  }, []);
  
  const filteredPatients = patients.filter((patient) =>
    (patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id?.includes(searchTerm) ||
    patient.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.doctor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.professional?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (patient.status !== "Enfermagem")
  );
  
  const handleCallPatient = (patient: any) => {
    toast({
      title: "Paciente Chamado",
      description: `${patient.name} foi chamado para consulta`,
    });
  };
  
  const handleCancelAppointment = (patient: any) => {
    toast({
      title: "Consulta Cancelada",
      description: `A consulta de ${patient.name} foi cancelada`,
    });
  };
  
  const handleStartConsult = (patient: any) => {
    navigate(`/patient/${patient.id}`);
  };
  
  return (
    <Layout>
      <div className="page-container">
        <div className="mb-8 section-fade">
          <h1 className="text-2xl font-semibold tracking-tight">Agendamento</h1>
          <p className="text-muted-foreground">Gerencie consultas agendadas</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative w-full max-w-sm section-fade">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome, registro ou especialidade..."
              className="pl-8 border-teal-500/20 focus-visible:ring-teal-500/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal border-teal-500/20 hover:border-teal-500/30 hover:bg-teal-50",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-teal-500" />
                {date ? format(date, "PPP") : <span>Selecionar data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Card className="section-fade system-card" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarCheck className="h-5 w-5 mr-2 text-teal-500" />
              Consultas Agendadas - {format(date, "dd/MM/yyyy")}
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                      <div className="flex items-start md:items-center">
                        <User className="h-5 w-5 mr-2 text-muted-foreground mt-0.5 md:mt-0" />
                        <div>
                          <h3 className="font-medium">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">Registro: {patient.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground">Especialidade</p>
                          <p className="font-medium">{patient.specialty || patient.speciality || "Não especificada"}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Médico</p>
                          <p className="font-medium">{patient.doctor || patient.professional || "Não definido"}</p>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="font-medium">{patient.time}</span>
                        </div>
                      </div>
                    </div>
                    
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
                        onClick={() => handleCancelAppointment(patient)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
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
                  <p className="text-muted-foreground">Nenhuma consulta encontrada para os critérios selecionados.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Appointment;
