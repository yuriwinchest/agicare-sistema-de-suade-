import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Phone, User, CheckCircle2, Pen, Trash, Activity, Users } from "lucide-react";
import { getStatusClass, getDisplayStatus } from "./patientStatusUtils";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PatientActionsDialog from "@/components/electronic-record/PatientActionsDialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Definição de larguras fixas para cada coluna em pixels
const columnClasses = [
  "w-[70px]",       // Protocolo
  "w-[130px]",      // Paciente (reduzido mais)
  "w-[100px]",      // CPF (reduzido)
  "w-[110px]",      // Recepção (reduzido)
  "w-[90px]",       // Data / Hora (reduzido)
  "w-[120px]",      // Especialidade (reduzido)
  "w-[130px]",      // Profissional (reduzido)
  "w-[100px]",      // Convênio (reduzido)
  "w-[80px]",       // Status (reduzido)
  "w-[140px]"       // Ações (aumentado para acomodar os botões e texto completo)
];

const PENDENTE_TOOLTIP = "O status será alterado para 'Confirmado' quando a especialidade, data e horário forem preenchidos no perfil deste paciente.";

const PendingNameHoverCard = ({ children }) => (
  <HoverCard openDelay={100}>
    <HoverCardTrigger asChild>
      <span className="font-medium text-gray-800 group-hover:text-teal-800 cursor-pointer">{children}</span>
    </HoverCardTrigger>
    <HoverCardContent className="p-3 rounded-lg bg-[#F6FDFF] dark:bg-[#282d3c] border border-teal-100 dark:border-[#282d3c] shadow-lg max-w-xs text-xs text-teal-900 dark:text-teal-100">
      <div className="font-semibold text-teal-700 dark:text-teal-300 mb-1">Finalização do Cadastro</div>
      <div className="text-xs opacity-80">
        Preencha a <b>especialidade</b>, <b>data</b> e <b>horário</b> no perfil deste paciente para alterar o status para <span className="font-medium text-blue-600 dark:text-blue-300">Confirmado</span>.
      </div>
    </HoverCardContent>
  </HoverCard>
);

const PatientTable = ({ patients, isLoading }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePatientClick = (patient) => {
    navigate(`/patient/${patient.id}`);
  };

  const handleCheckIn = (patient) => {
    // Fornecer feedback visual antes da navegação
    toast({
      title: "Iniciando Check-in",
      description: "Aguarde enquanto carregamos o formulário de recepção...",
    });
    
    // Pequeno atraso para dar tempo de ver o toast antes de navegar
    setTimeout(() => {
      navigate(`/patient-reception/${patient.id}`);
    }, 500);
  };

  const handleDelete = async (patientId: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientId);

      if (error) throw error;

      toast({
        title: "Paciente excluído",
        description: "O paciente foi excluído com sucesso.",
      });

      window.location.reload();
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o paciente.",
        variant: "destructive"
      });
    }
  };

  const handlePatientCall = (patient: any) => {
    toast({
      title: "Paciente Chamado",
      description: `${patient.name} foi chamado para atendimento`,
    });
  };

  const handlePatientAttend = (patient: any) => {
    navigate(`/patient/${patient.id}`);
  };

  const handleViewFlow = (patientId: string) => {
    navigate(`/patient-flow/${patientId}`);
  };

  // Helper to safely format date/time for display
  const formatDateTime = (date?: string, time?: string) => {
    let formattedDate = "Não agendado";
    let formattedTime = "Não definido";
    
    if (date) {
      // Format date if it's in ISO format (YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
        const [year, month, day] = date.split('-');
        formattedDate = `${day}/${month}/${year}`;
      } else {
        formattedDate = date;
      }
    }
    
    // Use the provided time or default
    if (time) {
      formattedTime = time;
    }
    
    return { formattedDate, formattedTime };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aguardando":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Em Atendimento":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Finalizado":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelado":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <Card className="system-card">
        <CardContent className="py-8 text-center">
          <span>Carregando pacientes...</span>
        </CardContent>
      </Card>
    );
  }

  // Log the patients received by the component for debugging
  console.log("PatientTable rendering with patients:", patients);

  return (
    <Card className="system-card border-0">
      <CardContent className="p-0 rounded-lg overflow-hidden bg-white/80 dark:bg-slate-900/80">
        <div className="w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
          {patients.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nenhum paciente encontrado
            </div>
          ) : (
            <TooltipProvider>
              <Table className="w-full border-collapse">
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white">
                    <TableHead className={`${columnClasses[0]} text-white font-bold uppercase tracking-wider px-1 py-1.5 text-center text-xs`}>Protocolo</TableHead>
                    <TableHead className={`${columnClasses[1]} text-white font-bold uppercase tracking-wider px-1 py-1.5 text-xs`}>Paciente</TableHead>
                    <TableHead className={`${columnClasses[2]} text-white font-bold uppercase tracking-wider px-1 py-1.5 text-xs`}>CPF</TableHead>
                    <TableHead className={`${columnClasses[3]} text-white font-bold uppercase tracking-wider px-1 py-1.5 text-xs`}>Recepção</TableHead>
                    <TableHead className={`${columnClasses[4]} text-white font-bold uppercase tracking-wider px-1 py-1.5 text-center text-xs`}>Data / Hora</TableHead>
                    <TableHead className={`${columnClasses[5]} text-white font-bold uppercase tracking-wider px-1 py-1.5 text-xs`}>Especialidade</TableHead>
                    <TableHead className={`${columnClasses[6]} text-white font-bold uppercase tracking-wider px-1 py-1.5 text-xs`}>Profissional</TableHead>
                    <TableHead className={`${columnClasses[7]} text-white font-bold uppercase tracking-wider px-1 py-1.5 text-xs`}>Convênio</TableHead>
                    <TableHead className={`${columnClasses[8]} text-white font-bold uppercase tracking-wider px-1 py-1.5 text-center text-xs`}>Status</TableHead>
                    <TableHead className={`${columnClasses[9]} text-white font-bold uppercase tracking-wider px-1 py-1.5 text-center text-xs`}>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => {
                    // Handle possible null/undefined patient
                    if (!patient) return null;
                    
                    // Make sure we have valid values
                    const displayStatus = getDisplayStatus(patient);
                    const statusClass = getStatusClass(displayStatus);
                    
                    // Format date and time for display
                    const { formattedDate, formattedTime } = formatDateTime(patient.date, patient.appointmentTime);

                    return (
                      <PatientActionsDialog
                        key={patient.id}
                        patientId={patient.id}
                        onCall={() => handlePatientCall(patient)}
                        onAttend={() => handlePatientAttend(patient)}
                      >
                        <TableRow 
                          className="group transition-colors duration-200 hover:bg-blue-50/70 dark:hover:bg-slate-800"
                          onClick={() => handlePatientClick(patient)}
                        >
                          <TableCell className={`${columnClasses[0]} font-bold text-gray-700 group-hover:text-teal-700 px-1 py-1.5 text-center text-xs`}>
                            {patient.protocol_number 
                              ? String(patient.protocol_number).padStart(3, "0")
                              : "--"
                            }
                          </TableCell>
                          <TableCell className={`${columnClasses[1]} px-1 py-1.5`}>
                            {displayStatus === "Pendente" ? (
                              <div onClick={(e) => e.stopPropagation()} className="w-fit">
                                <PendingNameHoverCard>{patient.name}</PendingNameHoverCard>
                              </div>
                            ) : (
                              <span className="font-medium text-gray-800 group-hover:text-teal-800 text-xs">{patient.name}</span>
                            )}
                          </TableCell>
                          <TableCell className={`${columnClasses[2]} px-1 py-1.5 text-xs`}>
                            {patient.cpf || <span className="text-xs text-muted-foreground">Não informado</span>}
                          </TableCell>
                          <TableCell className={`${columnClasses[3]} px-1 py-1.5 text-xs`}>
                            {patient.reception || <span className="text-xs text-muted-foreground">Não definida</span>}
                          </TableCell>
                          <TableCell className={`${columnClasses[4]} px-1 py-1.5 text-center`}>
                            <div className="flex flex-col items-center justify-center text-gray-600 group-hover:text-teal-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs">{formattedDate}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs">{formattedTime}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className={`${columnClasses[5]} px-1 py-1.5 text-xs`}>
                            {patient.specialty || <span className="text-xs text-muted-foreground">Não definida</span>}
                          </TableCell>
                          <TableCell className={`${columnClasses[6]} px-1 py-1.5 text-xs`}>
                            {patient.professional || <span className="text-xs text-muted-foreground">Não definido</span>}
                          </TableCell>
                          <TableCell className={`${columnClasses[7]} px-1 py-1.5 text-xs`}>
                            {patient.health_plan || <span className="text-xs text-muted-foreground">Não informado</span>}
                          </TableCell>
                          <TableCell className={`${columnClasses[8]} px-1 py-1.5 text-center`}>
                            {displayStatus === "Pendente" ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className={`${statusClass} cursor-help text-xs group-hover:scale-105 transition-transform mx-auto inline-block`}>
                                    {displayStatus}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="bg-amber-50 text-amber-800 border border-amber-200">
                                  {PENDENTE_TOOLTIP}
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <span className={`${statusClass} mx-auto inline-block text-xs`}>{displayStatus}</span>
                            )}
                          </TableCell>
                          <TableCell className={`${columnClasses[9]} px-1 py-1.5 text-center`}>
                            <div className="flex justify-center items-center space-x-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0 text-gray-500 hover:text-teal-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/patient/${patient.id}`);
                                }}
                              >
                                <User className="h-3.5 w-3.5" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-6 w-6 p-0 text-gray-500 hover:text-teal-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/patient-registration/${patient.id}`);
                                }}
                              >
                                <Pen className="h-3.5 w-3.5" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-6 w-6 p-0 text-gray-500 hover:text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
                                    handleDelete(patient.id);
                                  }
                                }}
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </Button>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="xs"
                                    variant="outline"
                                    className="h-6 px-2 text-[10px] border-teal-200 text-teal-700 hover:bg-teal-50 whitespace-nowrap"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCheckIn(patient);
                                    }}
                                  >
                                    <Users className="h-3 w-3 mr-0.5" />
                                    Check-in
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-teal-50 text-teal-800 border border-teal-200 p-2 max-w-xs">
                                  <p className="font-medium text-xs">Registrar Check-in do Paciente</p>
                                  <p className="text-[10px] mt-1">
                                    Preencher informações de recepção, incluindo:
                                  </p>
                                  <ul className="text-[9px] list-disc pl-3 mt-1 space-y-0.5">
                                    <li>Tipo de atendimento</li>
                                    <li>Especialidade e profissional</li>
                                    <li>Convênio e forma de pagamento</li>
                                    <li>Local de origem e procedimento</li>
                                    <li>Dados do responsável (se menor)</li>
                                  </ul>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      </PatientActionsDialog>
                    );
                  })}
                </TableBody>
              </Table>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientTable;
