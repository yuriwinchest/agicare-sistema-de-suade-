
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, AlertCircle } from "lucide-react";

const ReceptionShortcuts = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card className="backdrop-blur-sm bg-white/40 dark:bg-slate-900/40 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <Building className="h-5 w-5 text-teal-500" />
          Recepções
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          <Button variant="outline" className="justify-start font-normal h-auto py-2 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80">
            <div className="flex justify-between items-center w-full">
              <span>Recepção Central</span>
            </div>
          </Button>
          <Button variant="outline" className="justify-start font-normal h-auto py-2 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80">
            <div className="flex justify-between items-center w-full">
              <span>Recepção Pediatria</span>
            </div>
          </Button>
          <Button variant="outline" className="justify-start font-normal h-auto py-2 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80">
            <div className="flex justify-between items-center w-full">
              <span>Recepção Ortopedia</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
    <Card className="system-card md:col-span-2 backdrop-blur-sm bg-white/40 dark:bg-slate-900/40 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Alertas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/50 rounded-md p-3 text-sm text-amber-800 dark:text-amber-200">
            <div className="font-medium">Pacientes aguardando atendimento</div>
            <div className="text-xs mt-1">Nenhum paciente em espera no momento.</div>
          </div>
          <div className="bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-md p-3 text-sm text-blue-800 dark:text-blue-200">
            <div className="font-medium">Confirmações pendentes</div>
            <div className="text-xs mt-1">Não há confirmações pendentes.</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ReceptionShortcuts;
