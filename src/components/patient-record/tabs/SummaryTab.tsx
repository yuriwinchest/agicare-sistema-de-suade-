
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SummaryTabProps {
  vitalSigns: {
    date: string;
    temperature: string;
    pressure: string;
    pulse: string;
    respiratory: string;
    oxygen: string;
  }[];
  medicalNotes: {
    id: string;
    date: string;
    title: string;
    doctor: string;
    content: string;
  }[];
  prescriptions: {
    id: string;
    date: string;
    doctor: string;
    items: {
      medication: string;
      dose: string;
      frequency: string;
      route: string;
    }[];
    nursingInstructions: {
      instruction: string;
      frequency: string;
    }[];
    diet: string;
  }[];
  labTests: {
    id: string;
    date: string;
    name: string;
    status: string;
  }[];
}

const SummaryTab: React.FC<SummaryTabProps> = ({ 
  vitalSigns, 
  medicalNotes, 
  prescriptions, 
  labTests 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Sinais Vitais Recentes</h2>
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
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Últimas Evoluções</h2>
        {medicalNotes.length > 0 ? (
          <div className="space-y-4">
            {medicalNotes.map((note) => (
              <div key={note.id} className="p-3 bg-white border rounded-md shadow-sm">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">{note.title}</h3>
                  <p className="text-sm text-muted-foreground">{note.date}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Por: {note.doctor}</p>
                <p className="text-sm">{note.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhuma evolução registrada</p>
        )}
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Prescrições Ativas</h2>
        {prescriptions.length > 0 ? (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="p-3 bg-white border rounded-md shadow-sm">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Prescrição Médica</h3>
                  <p className="text-sm text-muted-foreground">{prescription.date}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Por: {prescription.doctor}</p>
                <div>
                  <h4 className="text-sm font-medium mb-1">Medicações:</h4>
                  <ul className="space-y-1">
                    {prescription.items.map((item, index) => (
                      <li key={index} className="text-sm">
                        {item.medication} {item.dose}, {item.frequency}, {item.route}
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator className="my-2" />
                <div>
                  <h4 className="text-sm font-medium mb-1">Dieta:</h4>
                  <p className="text-sm">{prescription.diet}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhuma prescrição ativa</p>
        )}
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Exames Solicitados</h2>
        {labTests.length > 0 ? (
          <div className="space-y-2">
            {labTests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-3 bg-white border rounded-md shadow-sm">
                <div>
                  <h3 className="font-medium">{test.name}</h3>
                  <p className="text-sm text-muted-foreground">{test.date}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    test.status === "Pendente" 
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-100" 
                      : test.status === "Agendado"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        : "bg-green-100 text-green-800 hover:bg-green-100"
                  }
                >
                  {test.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum exame solicitado</p>
        )}
      </div>
    </div>
  );
};

export default SummaryTab;
