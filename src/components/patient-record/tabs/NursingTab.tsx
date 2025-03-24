
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  CalendarIcon, 
  Clock, 
  Save, 
  ClipboardList, 
  FileText, 
  Thermometer, 
  Activity, 
  Plus,
  Lock,
  Pill,
  Droplet,
  Stethoscope,
  FileSpreadsheet,
  CheckSquare,
  Search
} from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface NursingTabProps {
  vitalSigns: {
    date: string;
    temperature: string;
    pressure: string;
    pulse: string;
    respiratory: string;
    oxygen: string;
  }[];
  readOnly?: boolean;  // Propriedade para modo somente leitura
}

const NursingTab: React.FC<NursingTabProps> = ({ vitalSigns, readOnly = false }) => {
  const [nursingTab, setNursingTab] = useState("atendimento");
  const [newVitalSigns, setNewVitalSigns] = useState({
    temperature: "",
    pressure: "",
    pulse: "",
    respiratory: "",
    oxygen: ""
  });
  const [searchDate, setSearchDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleVitalSignChange = (field: string, value: string) => {
    setNewVitalSigns(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveVitalSigns = () => {
    // Logic to save vital signs would go here
    console.log("Saving vital signs:", newVitalSigns);
    
    // Reset form
    setNewVitalSigns({
      temperature: "",
      pressure: "",
      pulse: "",
      respiratory: "",
      oxygen: ""
    });
  };

  // Dados simulados para demonstração
  const hydricBalanceData = [
    { date: "21/03/2023", intake: "2500ml", output: "1800ml", balance: "+700ml" },
    { date: "20/03/2023", intake: "2100ml", output: "2300ml", balance: "-200ml" },
  ];
  
  const evolutionData = [
    { 
      date: "21/03/2023", 
      time: "14:30", 
      content: "Paciente apresentando melhora do quadro respiratório. Saturação em 98% em ar ambiente. Mantém-se afebril e hemodinamicamente estável." 
    },
    { 
      date: "20/03/2023", 
      time: "08:15", 
      content: "Paciente referindo dor moderada em região abdominal. Administrado analgésico conforme prescrição médica com melhora do quadro." 
    },
  ];
  
  const proceduresData = [
    { 
      date: "21/03/2023", 
      time: "10:00", 
      procedure: "Troca de Curativos", 
      status: "Realizado" 
    },
    { 
      date: "21/03/2023", 
      time: "08:30", 
      procedure: "Coleta de Exames", 
      status: "Realizado" 
    },
    { 
      date: "20/03/2023", 
      time: "16:45", 
      procedure: "Punção Venosa Periférica", 
      status: "Realizado" 
    },
  ];
  
  const medicationData = [
    { 
      date: "21/03/2023", 
      time: "12:00", 
      medication: "Dipirona", 
      dose: "500mg", 
      route: "Oral", 
      status: "Administrado" 
    },
    { 
      date: "21/03/2023", 
      time: "08:00", 
      medication: "Metoclopramida", 
      dose: "10mg", 
      route: "Endovenosa", 
      status: "Administrado" 
    },
    { 
      date: "20/03/2023", 
      time: "22:00", 
      medication: "Paracetamol", 
      dose: "750mg", 
      route: "Oral", 
      status: "Administrado" 
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-semibold">Enfermagem</h2>
        
        {readOnly && (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Lock className="h-3 w-3 mr-1" />
            Modo Visualização
          </Badge>
        )}
        
        {!readOnly && (
          <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white">
            <Plus className="mr-1 h-4 w-4" />
            Novo Registro
          </Button>
        )}
      </div>
      
      <Tabs value={nursingTab} onValueChange={setNursingTab} className="w-full">
        <TabsList className="grid grid-cols-7 mb-4">
          <TabsTrigger value="atendimento" className="text-xs">
            <Thermometer className="h-3.5 w-3.5 mr-1" />
            Sinais Vitais
          </TabsTrigger>
          <TabsTrigger value="balanço" className="text-xs">
            <Droplet className="h-3.5 w-3.5 mr-1" />
            Balanço Hídrico
          </TabsTrigger>
          <TabsTrigger value="evolucao" className="text-xs">
            <FileText className="h-3.5 w-3.5 mr-1" />
            Evolução
          </TabsTrigger>
          <TabsTrigger value="procedimentos" className="text-xs">
            <Stethoscope className="h-3.5 w-3.5 mr-1" />
            Procedimentos
          </TabsTrigger>
          <TabsTrigger value="sae" className="text-xs">
            <FileSpreadsheet className="h-3.5 w-3.5 mr-1" />
            SAE
          </TabsTrigger>
          <TabsTrigger value="formularios" className="text-xs">
            <ClipboardList className="h-3.5 w-3.5 mr-1" />
            Formulários
          </TabsTrigger>
          <TabsTrigger value="medicacao" className="text-xs">
            <Pill className="h-3.5 w-3.5 mr-1" />
            Medicação
          </TabsTrigger>
        </TabsList>
        
        {/* Atendimento Enfermagem / Sinais Vitais */}
        <TabsContent value="atendimento" className="space-y-6">
          {!readOnly && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Registrar Sinais Vitais</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperatura</Label>
                      <Input 
                        id="temperature" 
                        placeholder="°C"
                        value={newVitalSigns.temperature}
                        onChange={(e) => handleVitalSignChange('temperature', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pressure">Pressão Arterial</Label>
                      <Input 
                        id="pressure" 
                        placeholder="mmHg"
                        value={newVitalSigns.pressure}
                        onChange={(e) => handleVitalSignChange('pressure', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pulse">Pulso</Label>
                      <Input 
                        id="pulse" 
                        placeholder="bpm"
                        value={newVitalSigns.pulse}
                        onChange={(e) => handleVitalSignChange('pulse', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="respiratory">Freq. Respiratória</Label>
                      <Input 
                        id="respiratory" 
                        placeholder="irpm"
                        value={newVitalSigns.respiratory}
                        onChange={(e) => handleVitalSignChange('respiratory', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="oxygen">Saturação O2</Label>
                      <Input 
                        id="oxygen" 
                        placeholder="%"
                        value={newVitalSigns.oxygen}
                        onChange={(e) => handleVitalSignChange('oxygen', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button className="bg-teal-500 hover:bg-teal-600" onClick={handleSaveVitalSigns}>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div>
            <h3 className="text-md font-medium mb-3">Histórico de Sinais Vitais</h3>
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
        </TabsContent>
        
        {/* Balanço Hídrico */}
        <TabsContent value="balanço" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium">Histórico de Balanço Hídrico</h3>
                
                <div className="flex items-center space-x-2">
                  <div className="space-y-1">
                    <Label htmlFor="searchDate" className="text-xs">Data</Label>
                    <div className="flex items-center">
                      <Input
                        id="searchDate"
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="h-8 w-40"
                      />
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline" className="mt-6">
                    <Search className="h-4 w-4 mr-1" />
                    Filtrar
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="py-4">
                    <div className="flex flex-col items-center">
                      <h3 className="text-sm font-medium text-blue-600">TOTAL GANHOS</h3>
                      <p className="text-xl font-bold text-blue-700">2500 ml</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="py-4">
                    <div className="flex flex-col items-center">
                      <h3 className="text-sm font-medium text-amber-600">TOTAL PERDAS</h3>
                      <p className="text-xl font-bold text-amber-700">1800 ml</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="py-4">
                    <div className="flex flex-col items-center">
                      <h3 className="text-sm font-medium text-green-600">BALANÇO TOTAL</h3>
                      <p className="text-xl font-bold text-green-700">+700 ml</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Entrada</TableHead>
                      <TableHead>Saída</TableHead>
                      <TableHead>Balanço</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hydricBalanceData.length > 0 ? (
                      hydricBalanceData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.date}</TableCell>
                          <TableCell className="text-blue-600">{item.intake}</TableCell>
                          <TableCell className="text-amber-600">{item.output}</TableCell>
                          <TableCell className={item.balance.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                            {item.balance}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          Nenhum registro de balanço hídrico encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {readOnly && (
                <p className="text-amber-600 text-sm mt-4">
                  Modo de visualização ativo. Para registrar um novo balanço hídrico, acesse através do menu de Enfermagem.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Evolução Enfermagem */}
        <TabsContent value="evolucao" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium">Evoluções de Enfermagem</h3>
                
                {!readOnly && (
                  <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                    <Plus className="h-4 w-4 mr-1" />
                    Nova Evolução
                  </Button>
                )}
              </div>
              
              {evolutionData.length > 0 ? (
                <div className="space-y-4">
                  {evolutionData.map((evolution, index) => (
                    <Card key={index} className="bg-gray-50 border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground mr-3">{evolution.date}</span>
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">{evolution.time}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-md border">
                          <p className="text-sm">{evolution.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-md">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-muted-foreground">Nenhuma evolução de enfermagem registrada</p>
                </div>
              )}
              
              {readOnly && (
                <p className="text-amber-600 text-sm mt-4">
                  Modo de visualização ativo. Para registrar uma nova evolução, acesse através do menu de Enfermagem.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Procedimentos de Enfermagem */}
        <TabsContent value="procedimentos" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium">Procedimentos de Enfermagem</h3>
                
                {!readOnly && (
                  <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                    <Plus className="h-4 w-4 mr-1" />
                    Novo Procedimento
                  </Button>
                )}
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Procedimento</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proceduresData.length > 0 ? (
                      proceduresData.map((proc, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {proc.date} {proc.time}
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Stethoscope className="mr-2 h-4 w-4 text-teal-500" />
                              {proc.procedure}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckSquare className="mr-1 h-3 w-3" />
                              {proc.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          Nenhum procedimento registrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {readOnly && (
                <p className="text-amber-600 text-sm mt-4">
                  Modo de visualização ativo. Para registrar novos procedimentos, acesse através do menu de Enfermagem.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SAE */}
        <TabsContent value="sae">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-md font-medium mb-4">Sistematização da Assistência de Enfermagem (SAE)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium border-b pb-2">Diagnósticos de Enfermagem</h4>
                  <div className="p-4 bg-gray-50 rounded-md text-center">
                    <p className="text-muted-foreground">Nenhum diagnóstico registrado</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium border-b pb-2">Intervenções de Enfermagem</h4>
                  <div className="p-4 bg-gray-50 rounded-md text-center">
                    <p className="text-muted-foreground">Nenhuma intervenção registrada</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <h4 className="text-sm font-medium border-b pb-2">Resultados Esperados</h4>
                <div className="p-4 bg-gray-50 rounded-md text-center">
                  <p className="text-muted-foreground">Nenhum resultado esperado registrado</p>
                </div>
              </div>
              
              {readOnly && (
                <p className="text-amber-600 text-sm mt-4">
                  Modo de visualização ativo. Para implementar o SAE, acesse através do menu de Enfermagem.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Formulários Clínicos */}
        <TabsContent value="formularios">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-md font-medium mb-4">Formulários Clínicos de Enfermagem</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-1">Escala de Braden</h4>
                    <p className="text-sm text-muted-foreground mb-3">Avaliação de risco para lesão por pressão</p>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Não preenchido
                    </Badge>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-1">Escala de Morse</h4>
                    <p className="text-sm text-muted-foreground mb-3">Avaliação de risco de queda</p>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Não preenchido
                    </Badge>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-1">Escala de Glasgow</h4>
                    <p className="text-sm text-muted-foreground mb-3">Avaliação neurológica</p>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Não preenchido
                    </Badge>
                  </CardContent>
                </Card>
              </div>
              
              {readOnly && (
                <p className="text-amber-600 text-sm mt-4">
                  Modo de visualização ativo. Para preencher formulários clínicos, acesse através do menu de Enfermagem.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Checagem de Medicação */}
        <TabsContent value="medicacao" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium">Checagem de Medicamentos</h3>
                
                <div className="flex items-center space-x-2">
                  <div className="space-y-1">
                    <Label htmlFor="searchMedDate" className="text-xs">Data</Label>
                    <div className="flex items-center">
                      <Input
                        id="searchMedDate"
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="h-8 w-40"
                      />
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline" className="mt-6">
                    <Search className="h-4 w-4 mr-1" />
                    Filtrar
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Medicação</TableHead>
                      <TableHead>Dose/Via</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicationData.length > 0 ? (
                      medicationData.map((med, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {med.date} {med.time}
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Pill className="mr-2 h-4 w-4 text-purple-500" />
                              {med.medication}
                            </div>
                          </TableCell>
                          <TableCell>
                            {med.dose} / {med.route}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckSquare className="mr-1 h-3 w-3" />
                              {med.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          Nenhuma medicação registrada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {readOnly && (
                <p className="text-amber-600 text-sm mt-4">
                  Modo de visualização ativo. Para realizar checagem de medicações, acesse através do menu de Enfermagem.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NursingTab;
