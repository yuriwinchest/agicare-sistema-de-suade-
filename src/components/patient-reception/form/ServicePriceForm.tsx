import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  ShoppingCart, 
  Search, 
  PlusCircle, 
  Trash2,
  Calculator,
  ScanText,
  RadioIcon,
  Stethoscope,
  Activity
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  paymentService, 
  ServicePrice, 
  ServiceType, 
  ServiceCategory 
} from "@/services/payments";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

// Lista expandida de tipos de exames para busca rápida
const commonExamTypes = [
  { id: "raio-x", name: "Raio-X", icon: <RadioIcon className="h-4 w-4 text-amber-500 mr-2" /> },
  { id: "ultrassom", name: "Ultrassonografia", icon: <Activity className="h-4 w-4 text-blue-500 mr-2" /> },
  { id: "laboratorial", name: "Exames Laboratoriais", icon: <ScanText className="h-4 w-4 text-purple-500 mr-2" /> },
  { id: "cardiologia", name: "Exames Cardiológicos", icon: <Activity className="h-4 w-4 text-red-500 mr-2" /> },
  { id: "neurologia", name: "Exames Neurológicos", icon: <Activity className="h-4 w-4 text-green-500 mr-2" /> },
  { id: "respiratorios", name: "Exames Respiratórios", icon: <Activity className="h-4 w-4 text-teal-500 mr-2" /> },
];

// Lista expandida de tipos de procedimentos para busca rápida
const commonProcedureTypes = [
  { id: "curativos", name: "Curativos", icon: <Stethoscope className="h-4 w-4 text-teal-500 mr-2" /> },
  { id: "aplicacoes", name: "Aplicações de Medicamentos", icon: <Stethoscope className="h-4 w-4 text-blue-500 mr-2" /> },
  { id: "cirurgia", name: "Pequenas Cirurgias", icon: <Stethoscope className="h-4 w-4 text-red-500 mr-2" /> },
  { id: "fisioterapia", name: "Procedimentos Fisioterápicos", icon: <Stethoscope className="h-4 w-4 text-purple-500 mr-2" /> },
];

interface ServicePriceFormProps {
  onAddService: (service: {
    serviceId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
    notes?: string;
    location?: string;
  }) => void;
  selectedServices: Array<{
    serviceId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
    notes?: string;
    location?: string;
  }>;
  onRemoveService: (serviceId: string) => void;
  onUpdateQuantity: (serviceId: string, quantity: number) => void;
  onUpdateDiscount: (serviceId: string, discount: number) => void;
  onUpdateNotes?: (serviceId: string, notes: string) => void;
  onUpdateLocation?: (serviceId: string, location: string) => void;
  isHealthInsurance: boolean;
}

export const ServicePriceForm: React.FC<ServicePriceFormProps> = ({
  onAddService,
  selectedServices,
  onRemoveService,
  onUpdateQuantity,
  onUpdateDiscount,
  onUpdateNotes,
  onUpdateLocation,
  isHealthInsurance
}) => {
  const [activeTab, setActiveTab] = useState<string>("consultation");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [services, setServices] = useState<ServicePrice[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServicePrice[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [serviceNotes, setServiceNotes] = useState<string>("");
  const [serviceLocation, setServiceLocation] = useState<string>("");
  const [selectedServiceForNotes, setSelectedServiceForNotes] = useState<string | null>(null);
  const [quickFilterTag, setQuickFilterTag] = useState<string | null>(null);
  
  // Carregar todos os serviços e categorias ao montar o componente
  useEffect(() => {
    const loadData = async () => {
      try {
        const allCategories = await paymentService.getAllCategories();
        setCategories(allCategories);
        
        // Carregar serviços do tipo selecionado na tab
        const serviceType = activeTab.toUpperCase() as ServiceType;
        const serviceData = await paymentService.getServicesByType(serviceType);
        setServices(serviceData);
        setFilteredServices(serviceData);
      } catch (error) {
        console.error("Erro ao carregar serviços e categorias:", error);
      }
    };
    
    loadData();
  }, [activeTab]);
  
  // Filtrar serviços quando categoria é selecionada
  useEffect(() => {
    const filterByCategory = async () => {
      try {
        let filteredData: ServicePrice[] = [];
        
        if (selectedCategory) {
          filteredData = await paymentService.getServicesByCategory(selectedCategory);
        } else {
          const serviceType = activeTab.toUpperCase() as ServiceType;
          filteredData = await paymentService.getServicesByType(serviceType);
        }
        
        // Aplicar também o filtro de pesquisa
        if (searchTerm) {
          filteredData = filteredData.filter(
            service => 
              service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              service.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Aplicar filtro rápido por tag
        if (quickFilterTag) {
          filteredData = filteredData.filter(
            service => 
              service.name.toLowerCase().includes(quickFilterTag.toLowerCase()) ||
              service.description?.toLowerCase().includes(quickFilterTag.toLowerCase())
          );
        }
        
        setFilteredServices(filteredData);
      } catch (error) {
        console.error("Erro ao filtrar serviços por categoria:", error);
      }
    };
    
    filterByCategory();
  }, [selectedCategory, searchTerm, activeTab, quickFilterTag]);
  
  // Função para filtrar serviços por termo de pesquisa
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term) {
      setQuickFilterTag(null);
    }
  };
  
  // Função para filtrar rapidamente por tipo de exame/procedimento
  const handleQuickFilter = (filterValue: string) => {
    setQuickFilterTag(filterValue === quickFilterTag ? null : filterValue);
  };
  
  // Função para adicionar um serviço
  const handleAddService = (service: ServicePrice) => {
    onAddService({
      serviceId: service.id,
      name: service.name,
      quantity: 1, // Padrão: 1 unidade
      unitPrice: service.price,
      discount: isHealthInsurance ? 100 : 0, // 100% de desconto se for plano de saúde
      total: isHealthInsurance ? 0 : service.price,
      notes: serviceNotes, // Adicionar anotações
      location: serviceLocation // Adicionar localização
    });
    
    // Limpar campos de anotações após adicionar
    setServiceNotes("");
    setServiceLocation("");
    setIsDialogOpen(false);
  };
  
  // Função para formatar valor em reais
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  // Calcular valor total
  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => total + service.total, 0);
  };
  
  // Função para atualizar anotações
  const handleNotesUpdate = (serviceId: string, notes: string) => {
    if (onUpdateNotes) {
      onUpdateNotes(serviceId, notes);
    }
  };
  
  // Função para atualizar localização
  const handleLocationUpdate = (serviceId: string, location: string) => {
    if (onUpdateLocation) {
      onUpdateLocation(serviceId, location);
    }
  };
  
  // Função para editar anotações de um serviço
  const openNotesDialog = (serviceId: string) => {
    const service = selectedServices.find(s => s.serviceId === serviceId);
    if (service) {
      setServiceNotes(service.notes || "");
      setServiceLocation(service.location || "");
      setSelectedServiceForNotes(serviceId);
    }
  };
  
  // Renderizar ícone baseado no tipo de serviço
  const renderServiceIcon = (type: string, name: string) => {
    const lowerName = name.toLowerCase();
    
    if (type === "EXAM") {
      if (lowerName.includes("raio") || lowerName.includes("tomografia") || lowerName.includes("ressonância")) {
        return <RadioIcon className="h-4 w-4 text-amber-500 mr-2" />;
      } else if (lowerName.includes("ultra") || lowerName.includes("eco") || lowerName.includes("doppler")) {
        return <Activity className="h-4 w-4 text-blue-500 mr-2" />;
      } else if (lowerName.includes("laboratorial") || lowerName.includes("sangue") || lowerName.includes("urina")) {
        return <ScanText className="h-4 w-4 text-purple-500 mr-2" />;
      }
      return <FileText className="h-4 w-4 text-cyan-500 mr-2" />;
    } else if (type === "PROCEDURE") {
      return <Stethoscope className="h-4 w-4 text-teal-500 mr-2" />;
    }
    
    return <ShoppingCart className="h-4 w-4 text-gray-500 mr-2" />;
  };
  
  return (
    <>
      <Card className="border-teal-100">
        <CardHeader className="bg-teal-50/50">
          <CardTitle className="text-teal-700 text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Serviços e Valores
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {selectedServices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serviço</TableHead>
                  <TableHead className="w-20 text-right">Qtd.</TableHead>
                  <TableHead className="w-28 text-right">Preço Unit.</TableHead>
                  <TableHead className="w-20 text-right">Desc. %</TableHead>
                  <TableHead className="w-28 text-right">Total</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedServices.map((service) => (
                  <TableRow key={service.serviceId} className="text-sm">
                    <TableCell className="font-medium">
                      <div>
                        {service.name}
                        {(service.notes || service.location) && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge 
                                  variant="outline" 
                                  className="ml-2 cursor-pointer"
                                  onClick={() => openNotesDialog(service.serviceId)}
                                >
                                  Detalhes
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs max-w-xs">
                                  {service.location && (
                                    <p><strong>Local:</strong> {service.location}</p>
                                  )}
                                  {service.notes && (
                                    <p><strong>Obs:</strong> {service.notes}</p>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        min={1}
                        value={service.quantity}
                        onChange={(e) => onUpdateQuantity(service.serviceId, parseInt(e.target.value) || 1)}
                        className="w-16 ml-auto text-right"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(service.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={service.discount}
                        onChange={(e) => onUpdateDiscount(service.serviceId, parseInt(e.target.value) || 0)}
                        className="w-16 ml-auto text-right"
                        disabled={isHealthInsurance}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(service.total)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveService(service.serviceId)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-medium">
                    Valor Total:
                  </TableCell>
                  <TableCell className="text-right font-bold text-teal-700">
                    {formatCurrency(calculateTotal())}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed">
              <p className="text-gray-500">Nenhum serviço adicionado. Clique em "Adicionar Serviço" para começar.</p>
            </div>
          )}
          
          <div className="mt-4 flex justify-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-teal-600 hover:bg-teal-700 gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Adicionar Serviço
                </Button>
              </DialogTrigger>
              <DialogContent className="min-w-[500px] max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Serviço</DialogTitle>
                  <DialogDescription>
                    Selecione o serviço que deseja adicionar à conta.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar serviço..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="pl-10"
                      />
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${advancedSearch ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`}
                      onClick={() => setAdvancedSearch(!advancedSearch)}
                    >
                      Busca Avançada
                    </Button>
                  </div>
                  
                  {advancedSearch && (
                    <div className="p-3 bg-slate-50 rounded-md mb-4 border border-slate-200 space-y-3">
                      <div>
                        <Label>Categoria de Serviço</Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Todas as categorias" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Todas as categorias</SelectItem>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {activeTab === "exam" && (
                        <div>
                          <Label>Tipo de Exame</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {commonExamTypes.map(type => (
                              <Badge 
                                key={type.id} 
                                variant={quickFilterTag === type.id ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => handleQuickFilter(type.id)}
                              >
                                <span className="flex items-center">
                                  {type.icon}
                                  {type.name}
                                </span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {activeTab === "procedure" && (
                        <div>
                          <Label>Tipo de Procedimento</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {commonProcedureTypes.map(type => (
                              <Badge 
                                key={type.id} 
                                variant={quickFilterTag === type.id ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => handleQuickFilter(type.id)}
                              >
                                <span className="flex items-center">
                                  {type.icon}
                                  {type.name}
                                </span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <Tabs defaultValue="consultation" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4 w-full border">
                    <TabsTrigger value="consultation" className="flex-1">Consultas</TabsTrigger>
                    <TabsTrigger value="exam" className="flex-1">Exames</TabsTrigger>
                    <TabsTrigger value="procedure" className="flex-1">Procedimentos</TabsTrigger>
                    <TabsTrigger value="other" className="flex-1">Outros</TabsTrigger>
                  </TabsList>
                  
                  {/* Conteúdo para cada tab */}
                  {["consultation", "exam", "procedure", "other"].map((tabValue) => (
                    <TabsContent key={tabValue} value={tabValue} className="space-y-4">
                      <div className="border rounded-md divide-y max-h-64 overflow-y-auto">
                        {filteredServices.length > 0 ? (
                          filteredServices.map((service) => (
                            <div
                              key={service.id}
                              className="p-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                // Abrir diálogo para detalhes antes de adicionar
                                setServiceNotes("");
                                setServiceLocation("");
                                setSelectedServiceForNotes(service.id);
                              }}
                            >
                              <div>
                                <h4 className="font-medium flex items-center">
                                  {renderServiceIcon(service.type, service.name)}
                                  {service.name}
                                </h4>
                                {service.description && (
                                  <p className="text-sm text-gray-500 ml-6">{service.description}</p>
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setServiceNotes("");
                                    setServiceLocation("");
                                    setSelectedServiceForNotes(service.id);
                                  }}
                                >
                                  <PlusCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            Nenhum {tabValue === "exam" ? "exame" : tabValue === "procedure" ? "procedimento" : "serviço"} encontrado. 
                            Tente ajustar os filtros.
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
                
                {/* Detalhes do serviço selecionado */}
                {selectedServiceForNotes && (
                  <div className="mt-6 border-t pt-4">
                    <h3 className="font-medium mb-3">Detalhes do Serviço</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="service-location">Local/Região do Exame ou Procedimento</Label>
                        <Input
                          id="service-location"
                          placeholder="Ex: Tórax, Abdômen, Cotovelo direito..."
                          value={serviceLocation}
                          onChange={(e) => setServiceLocation(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="service-notes">Observações e Anotações</Label>
                        <Textarea
                          id="service-notes"
                          placeholder="Adicione observações ou instruções especiais..."
                          value={serviceNotes}
                          onChange={(e) => setServiceNotes(e.target.value)}
                          className="resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedServiceForNotes(null);
                          setServiceNotes("");
                          setServiceLocation("");
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => {
                          const service = services.find(s => s.id === selectedServiceForNotes);
                          if (service) {
                            handleAddService(service);
                          }
                          setSelectedServiceForNotes(null);
                        }}
                      >
                        Adicionar Serviço
                      </Button>
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Fechar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      
      {/* Diálogo para editar anotações de um serviço existente */}
      <Dialog 
        open={selectedServiceForNotes !== null && selectedServices.some(s => s.serviceId === selectedServiceForNotes)} 
        onOpenChange={(open) => {
          if (!open) setSelectedServiceForNotes(null);
        }}
      >
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Serviço</DialogTitle>
          </DialogHeader>
          
          {selectedServiceForNotes && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-service-location">Local/Região</Label>
                <Input
                  id="edit-service-location"
                  placeholder="Ex: Tórax, Abdômen, Cotovelo direito..."
                  value={serviceLocation}
                  onChange={(e) => setServiceLocation(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-service-notes">Observações</Label>
                <Textarea
                  id="edit-service-notes"
                  placeholder="Adicione observações ou instruções especiais..."
                  value={serviceNotes}
                  onChange={(e) => setServiceNotes(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedServiceForNotes(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (selectedServiceForNotes && onUpdateNotes) {
                  const serviceId = selectedServiceForNotes;
                  handleNotesUpdate(serviceId, serviceNotes);
                  
                  if (onUpdateLocation) {
                    handleLocationUpdate(serviceId, serviceLocation);
                  }
                  
                  setSelectedServiceForNotes(null);
                }
              }}
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}; 