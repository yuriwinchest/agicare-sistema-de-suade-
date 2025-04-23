
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, AlertCircle } from "lucide-react";

const ReceptionShortcuts = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card className="system-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Building className="h-5 w-5 text-teal-500" />
          Recepções
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          <Button variant="outline" className="justify-start font-normal h-auto py-2">
            <div className="flex justify-between items-center w-full">
              <span>Recepção Central</span>
            </div>
          </Button>
          <Button variant="outline" className="justify-start font-normal h-auto py-2">
            <div className="flex justify-between items-center w-full">
              <span>Recepção Pediatria</span>
            </div>
          </Button>
          <Button variant="outline" className="justify-start font-normal h-auto py-2">
            <div className="flex justify-between items-center w-full">
              <span>Recepção Ortopedia</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
    <Card className="system-card md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Alertas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
            <div className="font-medium">Pacientes aguardando atendimento</div>
            <div className="text-xs mt-1">Nenhum paciente em espera no momento.</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
            <div className="font-medium">Confirmações pendentes</div>
            <div className="text-xs mt-1">Não há confirmações pendentes.</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ReceptionShortcuts;
