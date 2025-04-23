
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Phone, User, CheckCircle2 } from "lucide-react";
import { getStatusClass, getDisplayStatus } from "./patientStatusUtils";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface PatientTableProps {
  patients: any[];
  isLoading: boolean;
}

const PENDENTE_TOOLTIP = "O status será alterado para 'Confirmado' quando a especialidade, data e horário forem preenchidos no perfil deste paciente.";

const PatientTable = ({ patients, isLoading }: PatientTableProps) => {
  const navigate = useNavigate();

  const handlePatientClick = (patient: any) => {
    navigate(`/patient-reception/${patient.id}`);
  };

  const handleCheckIn = (patient: any) => {
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
    <Card className="system-card border-2 border-teal-50 shadow-lg">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {patients.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nenhum paciente encontrado
            </div>
          ) : (
            <TooltipProvider>
              <Table>
                <TableHeader className="bg-teal-50/50">
                  <TableRow>
                    <TableHead className="text-teal-700 font-bold uppercase tracking-wider">Protocolo</TableHead>
                    <TableHead className="text-teal-700 font-bold uppercase tracking-wider">Paciente</TableHead>
                    <TableHead className="text-teal-700 font-bold uppercase tracking-wider">CPF</TableHead>
                    <TableHead className="text-teal-700 font-bold uppercase tracking-wider">Recepção</TableHead>
                    <TableHead className="text-teal-700 font-bold uppercase tracking-wider">Data / Hora</TableHead>
                    <TableHead className="text-teal-700 font-bold uppercase tracking-wider">Especialidade</TableHead>
                    <TableHead className="text-teal-700 font-bold uppercase tracking-wider">Telefone</TableHead>
                    <TableHead className="text-teal-700 font-bold uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-right text-teal-700 font-bold uppercase tracking-wider">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => {
                    const displayStatus = getDisplayStatus(patient);
                    const statusClass = getStatusClass(displayStatus);
                    return (
                      <TableRow 
                        key={patient.id} 
                        className="cursor-pointer hover:bg-teal-50/30 transition-colors duration-200 group"
                        onClick={() => handlePatientClick(patient)}
                      >
                        <TableCell className="font-medium text-gray-700 group-hover:text-teal-600">
                          {patient.protocol_number 
                            ? String(patient.protocol_number).padStart(3, "0")
                            : "--"
                          }
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-gray-800 group-hover:text-teal-700">{patient.name}</span>
                        </TableCell>
                        <TableCell>
                          {patient.cpf ? (
                            <span className="text-gray-600 group-hover:text-teal-600">{patient.cpf}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Não informado</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-700 group-hover:text-teal-600">{patient.reception || 'Não definida'}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-gray-600 group-hover:text-teal-600">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{patient.date ? patient.date : 'Não agendado'}</span>
                            <Clock className="ml-3 mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{patient.time ? patient.time : 'Não definido'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {patient.specialty ? (
                            <span className="text-gray-700 group-hover:text-teal-600">{patient.specialty}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Não definida</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-gray-600 group-hover:text-teal-600">
                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{patient.phone || 'Não informado'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
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
                        <TableCell className="text-right">
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
