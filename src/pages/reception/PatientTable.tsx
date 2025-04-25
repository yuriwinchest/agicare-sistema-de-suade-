
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Phone, User, CheckCircle2 } from "lucide-react";
import { getStatusClass, getDisplayStatus } from "./patientStatusUtils";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const columnClasses = [
  "w-20 min-w-[55px] max-w-[60px]",      // Protocolo
  "w-64 min-w-[140px] max-w-[220px]",    // Paciente
  "w-36 min-w-[70px] max-w-[120px]",     // CPF
  "w-40 min-w-[90px] max-w-[120px]",     // Recepção
  "w-52 min-w-[110px] max-w-[160px]",    // Data / Hora
  "w-40 min-w-[90px] max-w-[120px]",     // Especialidade
  "w-44 min-w-[110px] max-w-[170px]",    // Profissional
  "w-40 min-w-[90px] max-w-[120px]",     // Convênio
  "w-32 min-w-[60px] max-w-[90px]",      // Status
  "w-24 min-w-[60px] max-w-[80px]"       // Ações
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

  const handlePatientClick = (patient) => {
    navigate(`/patient/${patient.id}`);
  };

  const handleCheckIn = (patient) => {
    navigate(`/patient-reception/${patient.id}`);
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

  return (
    <Card className="system-card border-2 border-transparent shadow-lg bg-gradient-to-br from-teal-100/60 via-cyan-100/60 to-blue-50/40 p-1">
      <CardContent className="p-0 rounded-lg overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="overflow-x-auto">
          {patients.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nenhum paciente encontrado
            </div>
          ) : (
            <TooltipProvider>
              <Table className="bg-transparent">
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 shadow-md text-white">
                    <TableHead className={`${columnClasses[0]} text-white font-bold uppercase tracking-wider px-3 py-2`}>Protocolo</TableHead>
                    <TableHead className={`${columnClasses[1]} text-white font-bold uppercase tracking-wider px-3 py-2`}>Paciente</TableHead>
                    <TableHead className={`${columnClasses[2]} text-white font-bold uppercase tracking-wider px-3 py-2`}>CPF</TableHead>
                    <TableHead className={`${columnClasses[3]} text-white font-bold uppercase tracking-wider px-3 py-2`}>Recepção</TableHead>
                    <TableHead className={`${columnClasses[4]} text-white font-bold uppercase tracking-wider px-3 py-2`}>Data / Hora</TableHead>
                    <TableHead className={`${columnClasses[5]} text-white font-bold uppercase tracking-wider px-3 py-2`}>Especialidade</TableHead>
                    <TableHead className={`${columnClasses[6]} text-white font-bold uppercase tracking-wider px-3 py-2`}>Profissional</TableHead>
                    <TableHead className={`${columnClasses[7]} text-white font-bold uppercase tracking-wider px-3 py-2`}>Convênio</TableHead>
                    <TableHead className={`${columnClasses[8]} text-white font-bold uppercase tracking-wider px-3 py-2`}>Status</TableHead>
                    <TableHead className={`${columnClasses[9]} text-white font-bold uppercase tracking-wider px-3 py-2 text-right`}>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => {
                    const displayStatus = getDisplayStatus(patient);
                    const statusClass = getStatusClass(displayStatus);
                    const appointmentTime = patient.appointmentTime || 'Não definido';
                    const appointmentDate = patient.date || 'Não agendado';

                    return (
                      <TableRow
                        key={patient.id}
                        className="group transition-colors duration-200 hover:bg-blue-50/70 dark:hover:bg-slate-800"
                        onClick={() => handlePatientClick(patient)}
                      >
                        <TableCell className={`${columnClasses[0]} font-bold text-gray-700 group-hover:text-teal-700 px-3 py-2`}>
                          {patient.protocol_number 
                            ? String(patient.protocol_number).padStart(3, "0")
                            : "--"
                          }
                        </TableCell>
                        <TableCell className={`${columnClasses[1]} px-3 py-2`}>
                          {displayStatus === "Pendente" ? (
                            <div onClick={(e) => e.stopPropagation()} className="w-fit">
                              <PendingNameHoverCard>{patient.name}</PendingNameHoverCard>
                            </div>
                          ) : (
                            <span className="font-medium text-gray-800 group-hover:text-teal-800">{patient.name}</span>
                          )}
                        </TableCell>
                        <TableCell className={`${columnClasses[2]} px-3 py-2`}>
                          {patient.cpf || <span className="text-xs text-muted-foreground">Não informado</span>}
                        </TableCell>
                        <TableCell className={`${columnClasses[3]} px-3 py-2`}>
                          {patient.reception || 'Não definida'}
                        </TableCell>
                        <TableCell className={`${columnClasses[4]} px-3 py-2`}>
                          <div className="flex items-center text-gray-600 group-hover:text-teal-600 gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{appointmentDate}</span>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{appointmentTime}</span>
                          </div>
                        </TableCell>
                        <TableCell className={`${columnClasses[5]} px-3 py-2`}>
                          {patient.specialty || <span className="text-xs text-muted-foreground">Não definida</span>}
                        </TableCell>
                        <TableCell className={`${columnClasses[6]} px-3 py-2`}>
                          {patient.professional || <span className="text-xs text-muted-foreground">Não definido</span>}
                        </TableCell>
                        <TableCell className={`${columnClasses[7]} px-3 py-2`}>
                          {patient.health_plan || <span className="text-xs text-muted-foreground">Não informado</span>}
                        </TableCell>
                        <TableCell className={`${columnClasses[8]} px-3 py-2`}>
                          {displayStatus === "Pendente" ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className={`${statusClass} cursor-help group-hover:scale-105 transition-transform`}>
                                  {displayStatus}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-amber-50 text-amber-800 border border-amber-200">
                                {PENDENTE_TOOLTIP}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className={statusClass}>{displayStatus}</span>
                          )}
                        </TableCell>
                        <TableCell className={`${columnClasses[9]} px-3 py-2`}>
                          <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="teal-hover text-gray-500 hover:text-teal-600"
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
                              className="teal-hover text-gray-500 hover:text-teal-600"
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
