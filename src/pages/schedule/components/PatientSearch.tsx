
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PatientResult {
  id: string;
  name: string;
  phone: string;
  document: string;
}

interface PatientSearchProps {
  patientSearch: string;
  setPatientSearch: (value: string) => void;
  selectedPatient: string;
  handlePatientSelect: (patient: PatientResult) => void;
  patientResults: PatientResult[];
}

const PatientSearch: React.FC<PatientSearchProps> = ({
  patientSearch,
  setPatientSearch,
  selectedPatient,
  handlePatientSelect,
  patientResults,
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded-md space-y-4">
      <h3 className="font-medium">Buscar Paciente</h3>
      <div className="flex gap-2">
        <Input 
          placeholder="CPF, nome ou telefone do paciente" 
          value={patientSearch}
          onChange={(e) => setPatientSearch(e.target.value)}
          className="flex-1"
        />
        <Button type="button" className="bg-teal-600 hover:bg-teal-700">
          Buscar
        </Button>
      </div>
      
      {patientSearch && (
        <div className="border rounded-md divide-y">
          {patientResults.map((patient) => (
            <div 
              key={patient.id}
              className={`p-3 cursor-pointer hover:bg-gray-50 ${selectedPatient === patient.id ? 'bg-gray-100' : ''}`}
              onClick={() => handlePatientSelect(patient)}
            >
              <div className="font-medium">{patient.name}</div>
              <div className="text-sm text-gray-500 flex gap-3">
                <span>CPF: {patient.document}</span>
                <span>Tel: {patient.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
