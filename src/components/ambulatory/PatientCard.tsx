
import React from "react";
import { User, Clock, Stethoscope, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PatientCardProps {
  patient: any;
  onCall: (patient: any) => void;
  onCancel: (patient: any) => void;
  onAttend: (patient: any) => void;
  showActions?: boolean;
  variant?: 'default' | 'return' | 'observation';
}

export const PatientCard = ({
  patient,
  onCall,
  onCancel,
  onAttend,
  showActions = true,
  variant = 'default'
}: PatientCardProps) => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Urgente":
        return <Badge variant="destructive">Urgente</Badge>;
      case "Normal":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Normal</Badge>;
      case "Não Urgente":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Não Urgente</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Aguardando":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Aguardando</Badge>;
      case "Em Atendimento":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Em Atendimento</Badge>;
      case "Finalizado":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Finalizado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow border-teal-500/10 hover:border-teal-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <User className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <h3 className="font-medium">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">Registro: {patient.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {patient.time}{patient.duration ? ` (${patient.duration})` : ''}
              </span>
            </div>
            {variant === 'default' && getPriorityBadge(patient.priority || "Normal")}
            {variant === 'default' && getStatusBadge(patient.status)}
            {(variant === 'return' || variant === 'observation') && (
              <Badge variant="outline" className={
                variant === 'observation' ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : undefined
              }>{patient.reason}</Badge>
            )}
          </div>
        </div>
      </div>

      {patient.triage && (
        <div className="bg-medgray-100 p-3 rounded-md mb-4">
          <div className="flex items-center mb-2">
            <Stethoscope className="h-4 w-4 mr-1 text-muted-foreground" />
            <h4 className="text-sm font-medium">Acolhimento</h4>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Temperatura</p>
              <p className="text-sm">{patient.triage.temp}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pressão</p>
              <p className="text-sm">{patient.triage.pressure}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sintomas</p>
              <p className="text-sm">{patient.triage.symptoms}</p>
            </div>
          </div>
        </div>
      )}

      {showActions && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-teal-500/20 text-teal-600 hover:bg-teal-50 hover:border-teal-500/30"
            onClick={() => onCall(patient)}
          >
            Chamar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => onCancel(patient)}
          >
            <X className="h-4 w-4 mr-1" />
            Desistência
          </Button>
          <Button
            size="sm"
            className="bg-teal-500 text-white hover:bg-teal-600"
            onClick={() => onAttend(patient)}
          >
            <Stethoscope className="h-4 w-4 mr-1" />
            {variant === 'observation' ? 'Avaliar' : 'Atender'}
          </Button>
        </div>
      )}
    </div>
  );
};
