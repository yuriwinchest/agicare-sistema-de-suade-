
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface PatientInfoProps {
  patientInfo: {
    id: string;
    name: string;
    protocol_number?: number;
    age?: number;
    birthdate?: string;
    gender?: string;
    allergies?: { substance: string; reaction: string }[];
  };
}

const PatientInfoHeader: React.FC<PatientInfoProps> = ({ patientInfo }) => {
  const [showAllergies, setShowAllergies] = useState(false);
  
  // Add safety check for allergies to prevent "Cannot read properties of undefined (reading 'length')"
  const allergies = patientInfo.allergies || [];
  const hasAllergies = allergies.length > 0;
  
  return (
    <Card className="col-span-full section-fade">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight mb-1">{patientInfo.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <span className="font-medium mr-1">Registro:</span> 
                {patientInfo.protocol_number 
                  ? String(patientInfo.protocol_number).padStart(3, "0") 
                  : patientInfo.id
                }
              </div>
              {patientInfo.age && (
                <div className="flex items-center">
                  <span className="font-medium mr-1">Idade:</span> {patientInfo.age} anos
                </div>
              )}
              {patientInfo.birthdate && (
                <div className="flex items-center">
                  <span className="font-medium mr-1">Nascimento:</span> {patientInfo.birthdate}
                </div>
              )}
              {patientInfo.gender && (
                <div className="flex items-center">
                  <span className="font-medium mr-1">Gênero:</span> {patientInfo.gender}
                </div>
              )}
            </div>
          </div>
          
          {hasAllergies && (
            <div className="flex items-center">
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => setShowAllergies(!showAllergies)}
              >
                <AlertCircle className="text-amber-500 h-5 w-5 mr-1" />
                <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                  Alergias: {allergies.length}
                </Badge>
              </div>
            </div>
          )}
        </div>
        
        {showAllergies && hasAllergies && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <h3 className="font-medium text-amber-800 mb-2">Alergias Registradas</h3>
            <ul className="space-y-2">
              {allergies.map((allergy, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{allergy.substance}:</span> {allergy.reaction}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientInfoHeader;
