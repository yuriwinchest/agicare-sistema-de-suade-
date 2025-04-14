
import React from "react";
import { PatientCard } from "./PatientCard";

interface PatientListProps {
  patients: any[];
  onCall: (patient: any) => void;
  onCancel: (patient: any) => void;
  onAttend: (patient: any) => void;
  variant?: 'default' | 'return' | 'observation';
  emptyMessage?: string;
}

export const PatientList = ({
  patients,
  onCall,
  onCancel,
  onAttend,
  variant = 'default',
  emptyMessage = "Nenhum paciente encontrado."
}: PatientListProps) => {
  if (patients.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <PatientCard
          key={patient.id}
          patient={patient}
          onCall={onCall}
          onCancel={onCancel}
          onAttend={onAttend}
          variant={variant}
          showActions={variant === 'default' ? patient.status !== "Finalizado" : true}
        />
      ))}
    </div>
  );
};
