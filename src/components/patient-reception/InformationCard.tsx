
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Stethoscope } from "lucide-react";

export const InformationCard = () => {
  return (
    <Card className="col-span-full md:col-span-1 section-fade system-card h-fit" style={{ animationDelay: "0.1s" }}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Stethoscope className="h-5 w-5 mr-2 text-teal-500" />
          Informações do Atendimento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-teal-50 border border-teal-100 rounded-md p-4">
          <h3 className="font-medium text-teal-700 mb-2 flex items-center">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Próximos passos
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="bg-teal-200 text-teal-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
              <span>Preencha os dados do atendimento</span>
            </li>
            <li className="flex items-start">
              <span className="bg-teal-200 text-teal-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
              <span>Confirme as informações</span>
            </li>
            <li className="flex items-start">
              <span className="bg-teal-200 text-teal-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
              <span>O paciente aparecerá na lista de atendimento ambulatorial</span>
            </li>
          </ul>
        </div>

        <div className="p-4 border border-amber-200 bg-amber-50 rounded-md">
          <p className="text-sm text-amber-800">
            Os campos marcados com <span className="text-red-500">*</span> são obrigatórios para continuar o atendimento.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
