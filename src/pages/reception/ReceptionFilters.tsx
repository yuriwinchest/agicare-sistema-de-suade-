
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

interface ReceptionFiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  receptionFilter: string;
  setReceptionFilter: (v: string) => void;
}

const ReceptionFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  receptionFilter,
  setReceptionFilter
}: ReceptionFiltersProps) => (
  <Card className="system-card">
    <CardHeader className="pb-3">
      <CardTitle className="text-lg font-medium">Filtros</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patient-search">Paciente / CPF</Label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="patient-search"
              placeholder="Buscar por nome ou CPF"
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reception-filter">Recepção</Label>
          <Select value={receptionFilter} onValueChange={setReceptionFilter}>
            <SelectTrigger id="reception-filter">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              <SelectItem value="RECEPÇÃO CENTRAL">RECEPÇÃO CENTRAL</SelectItem>
              <SelectItem value="RECEPÇÃO PEDIATRIA">RECEPÇÃO PEDIATRIA</SelectItem>
              <SelectItem value="RECEPÇÃO ORTOPEDIA">RECEPÇÃO ORTOPEDIA</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Confirmado">Confirmado</SelectItem>
              <SelectItem value="Aguardando">Aguardando</SelectItem>
              <SelectItem value="Atendido">Atendido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ReceptionFilters;
