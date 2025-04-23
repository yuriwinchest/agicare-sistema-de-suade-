
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, AlertCircle } from "lucide-react";

const CARD_BG =
  "backdrop-blur-md bg-white/80 dark:bg-slate-900/75 border border-gray-200/70 dark:border-gray-800/70 shadow-xl";

const ReceptionShortcuts = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card className={CARD_BG}>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <Building className="h-5 w-5 text-teal-500" />
          Recepções
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          <Button variant="outline" className="justify-start font-normal h-auto py-2 bg-white/70 dark:bg-slate-800/70 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-colors">
            <div className="flex justify-between items-center w-full">
              <span>Recepção Central</span>
            </div>
          </Button>
          <Button variant="outline" className="justify-start font-normal h-auto py-2 bg-white/70 dark:bg-slate-800/70 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-colors">
            <div className="flex justify-between items-center w-full">
              <span>Recepção Pediatria</span>
            </div>
          </Button>
          <Button variant="outline" className="justify-start font-normal h-auto py-2 bg-white/70 dark:bg-slate-800/70 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-colors">
            <div className="flex justify-between items-center w-full">
              <span>Recepção Ortopedia</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
    <Card className={`system-card ${CARD_BG}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Alertas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="bg-amber-50/90 dark:bg-amber-900/30 border border-amber-200/80 dark:border-amber-700/70 rounded-md p-2 text-xs text-amber-800 dark:text-amber-200">
          <div className="font-medium text-xs">Pacientes aguardando atendimento</div>
          <div className="text-[0.6rem] mt-0.5 opacity-70">Nenhum paciente em espera no momento.</div>
        </div>
        <div className="bg-blue-50/90 dark:bg-blue-900/30 border border-blue-200/80 dark:border-blue-700/70 rounded-md p-2 text-xs text-blue-800 dark:text-blue-200">
          <div className="font-medium text-xs">Confirmações pendentes</div>
          <div className="text-[0.6rem] mt-0.5 opacity-70">Não há confirmações pendentes.</div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ReceptionShortcuts;
