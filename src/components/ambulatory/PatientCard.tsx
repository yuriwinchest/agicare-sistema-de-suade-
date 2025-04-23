import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dot, Phone, Clipboard } from "lucide-react";

interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    protocol_number?: number;
    age?: number;
    status?: string;
    gender?: string;
    health_plan?: string;
    doctor?: string;
    specialty?: string;
    arrival_time?: string;
    wait_time?: string;
    reception?: string;
  };
  onCall: (patient: any) => void;
  onCancel: (patient: any) => void;
  onAttend: (patient: any) => void;
  variant?: 'default' | 'return' | 'observation';
  showActions?: boolean;
}

export const PatientCard = ({
  patient,
  onCall,
  onCancel,
  onAttend,
  variant = 'default',
  showActions = true
}: PatientCardProps) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Aguardando":
        return "status-critical";
      case "Em Atendimento":
        return "status-in-progress";
      case "Finalizado":
        return "status-completed";
      case "Retornando":
        return "status-return";
      case "Observação":
        return "status-waiting";
      default:
        return "status-waiting";
    }
  };

  const StatusBadge = ({ status }: { status: string }) => (
    <Badge variant="outline" className={`border-0 ${getStatusClass(status)}`}>
      {status}
    </Badge>
  );

  // Use protocol_number if available, otherwise format ID
  const displayId = patient.protocol_number 
    ? String(patient.protocol_number).padStart(3, "0")
    : patient.id.substring(0, 8);

  return (
    <div className="border rounded-md p-4 bg-white shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 items-start justify-between w-full">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-lg">{patient.name}</h3>
            {patient.status && (
              <StatusBadge status={patient.status} />
            )}
          </div>
          
          <div className="mt-1 text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-1">
              <Clipboard size={14} />
              <span>Registro: {displayId}</span>
            </div>
            {patient.age && (
              <div className="flex items-center gap-1">
                <Dot size={10} className="text-muted-foreground" />
                <span>{patient.age} anos</span>
              </div>
            )}
            {patient.health_plan && (
              <div className="flex items-center gap-1">
                <Dot size={10} className="text-muted-foreground" />
                <span>{patient.health_plan}</span>
              </div>
            )}
            {patient.doctor && (
              <div className="flex items-center gap-1">
                <Dot size={10} className="text-muted-foreground" />
                <span>Dr(a). {patient.doctor}</span>
              </div>
            )}
            {patient.specialty && (
              <div className="flex items-center gap-1">
                <Dot size={10} className="text-muted-foreground" />
                <span>{patient.specialty}</span>
              </div>
            )}
            {patient.reception && (
              <div className="flex items-center gap-1">
                <Dot size={10} className="text-muted-foreground" />
                <span>Recepção: {patient.reception}</span>
              </div>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-2">
            {variant === 'default' && (
              <>
                <Button size="sm" onClick={() => onCall(patient)}>
                  Chamar
                </Button>
                <Button variant="outline" size="sm" onClick={() => onCancel(patient)}>
                  Cancelar
                </Button>
              </>
            )}
            {variant === 'return' && (
              <Button size="sm" onClick={() => onAttend(patient)}>
                Atender
              </Button>
            )}
            {variant === 'observation' && (
              <Button size="sm" onClick={() => onAttend(patient)}>
                Liberar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
