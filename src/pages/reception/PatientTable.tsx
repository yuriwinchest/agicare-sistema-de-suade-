
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Phone, User, CheckCircle2 } from "lucide-react";
import { getStatusClass, getDisplayStatus } from "./patientStatusUtils";

interface PatientTableProps {
  patients: any[];
  isLoading: boolean;
}

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
    <Card className="system-card">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {patients.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nenhum paciente encontrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Protocolo</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Recepção</TableHead>
                  <TableHead>Data / Hora</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow 
                    key={patient.id} 
                    className="cursor-pointer hover:bg-teal-50/50"
                    onClick={() => handlePatientClick(patient)}
                  >
                    <TableCell className="font-medium">
                      {patient.protocol_number 
                        ? String(patient.protocol_number).padStart(3, "0")
                        : "--"
                      }
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{patient.name}</span>
                    </TableCell>
                    <TableCell>
                      {patient.cpf ? (
                        <span>{patient.cpf}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Não informado</span>
                      )}
                    </TableCell>
                    <TableCell>{patient.reception || 'Não definida'}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{patient.date ? patient.date : 'Não agendado'}</span>
                        <Clock className="ml-3 mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{patient.time ? patient.time : 'Não definido'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {patient.specialty ? (
                        <span>{patient.specialty}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Não definida</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{patient.phone || 'Não informado'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`${getStatusClass(getDisplayStatus(patient))}`}>
                        {getDisplayStatus(patient)}
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientTable;
