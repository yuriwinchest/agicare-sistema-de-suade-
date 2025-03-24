
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
  Lock
} from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface NursingTabProps {
  vitalSigns: {
    date: string;
    temperature: string;
    pressure: string;
    pulse: string;
    respiratory: string;
    oxygen: string;
  }[];
  readOnly?: boolean;  // Nova propriedade para modo somente leitura
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
            Atendimento Enfermagem
          </TabsTrigger>
          <TabsTrigger value="balanço" className="text-xs">
            Balanço Hídrico
          </TabsTrigger>
          <TabsTrigger value="evolucao" className="text-xs">
            Evolução Enfermagem
          </TabsTrigger>
          <TabsTrigger value="procedimentos" className="text-xs">
            Procedimentos de Enfermagem
          </TabsTrigger>
          <TabsTrigger value="sae" className="text-xs">
            SAE
          </TabsTrigger>
          <TabsTrigger value="formularios" className="text-xs">
            Formulários Clínicos
          </TabsTrigger>
          <TabsTrigger value="checagem" className="text-xs">
            Checagem
          </TabsTrigger>
        </TabsList>
        
        {/* Atendimento Enfermagem */}
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
              <h3 className="text-md font-medium mb-4">Histórico de Balanço</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Data Inicial</Label>
                  <div className="flex items-center mt-2">
                    <Input
                      type="date"
                      defaultValue={format(new Date(), 'yyyy-MM-dd')}
                      readOnly={readOnly}
                    />
                  </div>
                </div>
                <div>
                  <Label>Data Final</Label>
                  <div className="flex items-center mt-2">
                    <Input
                      type="date"
                      defaultValue={format(new Date(), 'yyyy-MM-dd')}
                      readOnly={readOnly}
                    />
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md mt-4">
                <div className="grid grid-cols-7 bg-gray-100 p-2 text-xs font-medium border-b">
                  <div>Ações</div>
                  <div>Tipo</div>
                  <div>Administrado</div>
                  <div>Eliminação</div>
                  <div>Data de Início</div>
                  <div>Data de Término</div>
                  <div>Resultado</div>
                </div>
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Nenhum dado encontrado
                </div>
              </div>
              
              {!readOnly && (
                <div className="flex justify-end mt-4">
                  <Button className="bg-teal-500 hover:bg-teal-600">
                    Filtrar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Evolução Enfermagem */}
        <TabsContent value="evolucao" className="space-y-6">
          {!readOnly && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-md font-medium mb-4">Evolução de Enfermagem</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Data e Hora</Label>
                    <div className="flex gap-2">
                      <div className="flex items-center relative flex-1">
                        <Input
                          type="date"
                          defaultValue={format(new Date(), 'yyyy-MM-dd')}
                        />
                        <CalendarIcon className="absolute right-3 h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center relative flex-1">
                        <Input
                          type="time"
                          defaultValue={format(new Date(), 'HH:mm')}
                        />
                        <Clock className="absolute right-3 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Anotação</Label>
                    <Textarea 
                      className="min-h-32" 
                      placeholder="Registre a evolução de enfermagem do paciente..."
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button className="bg-teal-500 hover:bg-teal-600">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Evolução
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div>
            <h3 className="text-md font-medium mb-3">Evoluções Anteriores</h3>
            <p className="text-muted-foreground">Nenhuma evolução registrada</p>
          </div>
        </TabsContent>
        
        {/* Placeholder para outras abas */}
        <TabsContent value="procedimentos">
          <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="text-md font-medium mb-2">Procedimentos de Enfermagem</h3>
            <p className="text-muted-foreground">Área para registrar procedimentos de enfermagem realizados no paciente.</p>
            {readOnly && (
              <p className="text-amber-600 text-sm mt-2">Modo de visualização ativo. Para editar, acesse através do menu de Enfermagem.</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="sae">
          <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="text-md font-medium mb-2">Sistematização da Assistência de Enfermagem</h3>
            <p className="text-muted-foreground">Área para documentar o processo de enfermagem.</p>
            {readOnly && (
              <p className="text-amber-600 text-sm mt-2">Modo de visualização ativo. Para editar, acesse através do menu de Enfermagem.</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="formularios">
          <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="text-md font-medium mb-2">Formulários Clínicos</h3>
            <p className="text-muted-foreground">Acesso aos formulários clínicos específicos de enfermagem.</p>
            {readOnly && (
              <p className="text-amber-600 text-sm mt-2">Modo de visualização ativo. Para editar, acesse através do menu de Enfermagem.</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="checagem">
          <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="text-md font-medium mb-2">Checagem</h3>
            <p className="text-muted-foreground">Verificação e checagem de prescrições e procedimentos.</p>
            {readOnly && (
              <p className="text-amber-600 text-sm mt-2">Modo de visualização ativo. Para editar, acesse através do menu de Enfermagem.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NursingTab;
