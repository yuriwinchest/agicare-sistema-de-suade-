
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Phone, User, CheckCircle2 } from "lucide-react";
import { getStatusClass, getDisplayStatus } from "./patientStatusUtils";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

// Larguras fixas/específicas para colunas da tabela, melhorando layout de acordo com conteúdo
const columnClasses = [
  "w-24 min-w-[60px] max-w-[70px]",      // Protocolo
  "w-48 min-w-[120px] max-w-[180px]",    // Paciente
  "w-36 min-w-[70px] max-w-[120px]",     // CPF
  "w-40 min-w-[90px] max-w-[120px]",     // Recepção
  "w-52 min-w-[110px] max-w-[160px]",    // Data / Hora
  "w-40 min-w-[90px] max-w-[120px]",     // Especialidade
  "w-44 min-w-[110px] max-w-[170px]",    // Telefone
  "w-32 min-w-[60px] max-w-[90px]",      // Status
  "w-24 min-w-[60px] max-w-[80px] text-right" // Ações
];

const PENDENTE_TOOLTIP = "O status será alterado para 'Confirmado' quando a especialidade, data e horário forem preenchidos no perfil deste paciente.";

const PatientTable = ({ patients, isLoading }) => {
  const navigate = useNavigate();

  const handlePatientClick = (patient) => {
    navigate(`/patient-reception/${patient.id}`);
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
                    <TableHead className={columnClasses[0] + " text-white font-bold uppercase tracking-wider px-3 py-2"}>Protocolo</TableHead>
                    <TableHead className={columnClasses[1] + " text-white font-bold uppercase tracking-wider px-3 py-2"}>Paciente</TableHead>
                    <TableHead className={columnClasses[2] + " text-white font-bold uppercase tracking-wider px-3 py-2"}>CPF</TableHead>
                    <TableHead className={columnClasses[3] + " text-white font-bold uppercase tracking-wider px-3 py-2"}>Recepção</TableHead>
                    <TableHead className={columnClasses[4] + " text-white font-bold uppercase tracking-wider px-3 py-2"}>Data / Hora</TableHead>
                    <TableHead className={columnClasses[5] + " text-white font-bold uppercase tracking-wider px-3 py-2"}>Especialidade</TableHead>
                    <TableHead className={columnClasses[6] + " text-white font-bold uppercase tracking-wider px-3 py-2"}>Telefone</TableHead>
                    <TableHead className={columnClasses[7] + " text-white font-bold uppercase tracking-wider px-3 py-2"}>Status</TableHead>
                    <TableHead className={columnClasses[8] + " text-white font-bold uppercase tracking-wider px-3 py-2"}>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => {
                    const displayStatus = getDisplayStatus(patient);
                    const statusClass = getStatusClass(displayStatus);
                    return (
                      <TableRow 
                        key={patient.id} 
                        className="cursor-pointer hover:bg-blue-50/70 dark:hover:bg-slate-800 transition-colors duration-200 group"
                        onClick={() => handlePatientClick(patient)}
                      >
                        <TableCell className={columnClasses[0] + " font-bold text-gray-700 group-hover:text-teal-700 px-3 py-2"}>
                          {patient.protocol_number 
                            ? String(patient.protocol_number).padStart(3, "0")
                            : "--"
                          }
                        </TableCell>
                        <TableCell className={columnClasses[1] + " px-3 py-2"}>
                          <span className="font-medium text-gray-800 group-hover:text-teal-800">{patient.name}</span>
                        </TableCell>
                        <TableCell className={columnClasses[2] + " px-3 py-2"}>
                          {patient.cpf ? (
                            <span className="text-gray-600 group-hover:text-teal-600">{patient.cpf}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Não informado</span>
                          )}
                        </TableCell>
                        <TableCell className={columnClasses[3] + " px-3 py-2 text-gray-700 group-hover:text-teal-700"}>
                          {patient.reception || 'Não definida'}
                        </TableCell>
                        <TableCell className={columnClasses[4] + " px-3 py-2"}>
                          <div className="flex items-center text-gray-600 group-hover:text-teal-600 gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{patient.date ? patient.date : 'Não agendado'}</span>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{patient.time ? patient.time : 'Não definido'}</span>
                          </div>
                        </TableCell>
                        <TableCell className={columnClasses[5] + " px-3 py-2"}>
                          {patient.specialty ? (
                            <span className="text-gray-700 group-hover:text-teal-600">{patient.specialty}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Não definida</span>
                          )}
                        </TableCell>
                        <TableCell className={columnClasses[6] + " px-3 py-2"}>
                          <div className="flex items-center text-gray-600 group-hover:text-teal-700 gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{patient.phone || 'Não informado'}</span>
                          </div>
                        </TableCell>
                        <TableCell className={columnClasses[7] + " px-3 py-2"}>
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
                        <TableCell className={columnClasses[8] + " px-3 py-2"}>
                          <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.stopPropagation()}>
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
