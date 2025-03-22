
import React from "react";

interface NursingTabProps {
  vitalSigns: {
    date: string;
    temperature: string;
    pressure: string;
    pulse: string;
    respiratory: string;
    oxygen: string;
  }[];
}

const NursingTab: React.FC<NursingTabProps> = ({ vitalSigns }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-semibold">Enfermagem</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium mb-3">Últimos Sinais Vitais</h3>
          {vitalSigns.length > 0 ? (
            <div className="space-y-4">
              {vitalSigns.map((vs, index) => (
                <div key={index} className="p-3 bg-white border rounded-md shadow-sm">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{vs.date}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Temperatura</p>
                      <p className="font-medium">{vs.temperature}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pressão Arterial</p>
                      <p className="font-medium">{vs.pressure}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pulso</p>
                      <p className="font-medium">{vs.pulse}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Freq. Respiratória</p>
                      <p className="font-medium">{vs.respiratory}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Saturação O2</p>
                      <p className="font-medium">{vs.oxygen}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum sinal vital registrado</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NursingTab;
