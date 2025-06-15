import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Search, Check, X, PlusCircle, FileText } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { paymentService, ServicePrice } from "@/services/payments";

interface ExamRequestFormProps {
  patientId: string;
  doctorId: string;
  onSubmit: (data: {
    patientId: string;
    doctorId: string;
    examType: string;
    description: string;
    urgency: string;
    scheduledFor: Date | null;
    serviceId?: string;
    serviceName?: string;
    servicePrice?: number;
  }) => void;
  onCancel: () => void;
}

export const ExamRequestForm = ({ patientId, doctorId, onSubmit, onCancel }: ExamRequestFormProps) => {
  const [examType, setExamType] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [examServices, setExamServices] = useState<ServicePrice[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServicePrice[]>([]);
  const [selectedService, setSelectedService] = useState<ServicePrice | null>(null);
  
  // Carregar exames disponíveis ao montar o componente
  useEffect(() => {
    const loadExamServices = async () => {
      try {
        const services = await paymentService.getServicesByType("EXAM");
        setExamServices(services);
        setFilteredServices(services);
      } catch (error) {
        console.error("Erro ao carregar exames:", error);
      }
    };
    
    loadExamServices();
  }, []);
  
  // Filtrar exames baseado no termo de busca
  useEffect(() => {
    if (!searchTerm) {
      setFilteredServices(examServices);
      return;
    }
    
    const filtered = examServices.filter(
      service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredServices(filtered);
  }, [searchTerm, examServices]);
  
  // Selecionar um exame da lista
  const handleSelectExam = (service: ServicePrice) => {
    setSelectedService(service);
    setExamType(service.name);
  };
  
  // Limpar a seleção de exame
  const handleClearSelection = () => {
    setSelectedService(null);
    setExamType("");
  };
  
  // Função para formatar valor em reais
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  const handleSubmitExam = () => {
    onSubmit({
      patientId,
      doctorId,
      examType,
      description,
      urgency,
      scheduledFor: scheduledDate,
      serviceId: selectedService?.id,
      serviceName: selectedService?.name,
      servicePrice: selectedService?.price
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="exam-type">Tipo de Exame</Label>
          <div className="flex gap-2">
            <Input
              id="exam-type"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              placeholder="Tipo de exame a ser solicitado"
              className="flex-1"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="px-3">
                  <Search className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Selecionar Exame</DialogTitle>
                  <DialogDescription>
                    Busque e selecione o exame da tabela de preços
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar exame..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  <div className="border rounded-md divide-y max-h-64 overflow-y-auto">
                    {filteredServices.length > 0 ? (
                      filteredServices.map((service) => (
                        <div
                          key={service.id}
                          className="p-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSelectExam(service)}
                        >
                          <div>
                            <h4 className="font-medium">{service.name}</h4>
                            {service.description && (
                              <p className="text-sm text-gray-500">{service.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-teal-600">
                              {formatCurrency(service.price)}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-full"
                            >
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Nenhum exame encontrado. Tente ajustar a busca.
                      </div>
                    )}
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => {}}>
                    Fechar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {selectedService && (
            <div className="flex items-center justify-between rounded-md bg-teal-50 p-2 mt-1">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-500" />
                <span className="text-sm text-teal-700 font-medium">{selectedService.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-teal-600 font-semibold">
                  {formatCurrency(selectedService.price)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={handleClearSelection}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição/Observações</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Informações adicionais sobre o exame"
            className="min-h-[120px]"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="urgency">Urgência</Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger id="urgency">
                <SelectValue placeholder="Selecione o nível de urgência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Data Preferencial</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !scheduledDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledDate ? (
                    format(scheduledDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={handleSubmitExam}>
          Solicitar Exame
        </Button>
      </div>
    </div>
  );
}; 