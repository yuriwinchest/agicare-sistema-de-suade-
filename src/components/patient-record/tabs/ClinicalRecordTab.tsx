
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileText, Plus, Search, ClipboardList, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";

interface ClinicalRecordTabProps {
  clinicalRecords: {
    id: string;
    number: string;
    date: string;
    speciality: string;
    professional: string;
    type: string;
    status: string;
  }[];
  specialities: {
    id: string;
    name: string;
  }[];
}

// Form types based on the provided images
const formTypes = [
  { id: "1", name: "FICHA DE ATENDIMENTO AMBULATORIAL" },
  { id: "2", name: "EVOLUÇÃO MÉDICA" },
  { id: "3", name: "INTERNAÇÃO" },
  { id: "4", name: "RECEITUÁRIO CONTROLE ESPECIAL" },
  { id: "5", name: "FICHA DE ATENDIMENTO ODONTOLÓGICO" },
  { id: "6", name: "ANAMNESE MÉDICO DE ACOMPANHANTE" },
  { id: "7", name: "ATENDIMENTO MÉDICO - PARCIAL DE URGÊNCIA" },
];

// Ambulatory form interface
interface AmbulatoryFormValues {
  avaliacao: string;
  exameFisico: string;
  conduta: string;
  observacoes: string;
  cid: string;
  altaAposMedicacao: string;
}

const ClinicalRecordTab: React.FC<ClinicalRecordTabProps> = ({ 
  clinicalRecords,
  specialities
}) => {
  const { toast } = useToast();
  const [searchClinicalRecord, setSearchClinicalRecord] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [selectedFormType, setSelectedFormType] = useState("");
  
  // Initialize the form
  const ambulatoryForm = useForm<AmbulatoryFormValues>({
    defaultValues: {
      avaliacao: "",
      exameFisico: "",
      conduta: "",
      observacoes: "",
      cid: "",
      altaAposMedicacao: "sim"
    }
  });
  
  const handleAddClinicalRecord = () => {
    setIsNewRecordOpen(!isNewRecordOpen);
  };
  
  const handleFormSubmit = (values: AmbulatoryFormValues) => {
    console.log("Form submitted:", values);
    toast({
      title: "Ficha Clínica Salva",
      description: "A ficha clínica foi salva com sucesso",
    });
    setIsNewRecordOpen(false);
    setSelectedFormType("");
    ambulatoryForm.reset();
  };
  
  const renderSelectedForm = () => {
    if (!selectedFormType) return null;
    
    if (selectedFormType === "1") {
      return (
        <Form {...ambulatoryForm}>
          <form onSubmit={ambulatoryForm.handleSubmit(handleFormSubmit)} className="space-y-4 mt-4 border rounded-md p-4">
            <FormField
              control={ambulatoryForm.control}
              name="avaliacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">AVALIAÇÃO / EVOLUÇÃO</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-24" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={ambulatoryForm.control}
              name="exameFisico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">EXAME FÍSICO</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-24" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={ambulatoryForm.control}
              name="conduta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">CONDUTA</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-24" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={ambulatoryForm.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">OBSERVAÇÕES</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-24" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={ambulatoryForm.control}
              name="cid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">CID</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Informe o(s) CID" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A00">A00 - Cólera</SelectItem>
                        <SelectItem value="J00">J00 - Nasofaringite aguda</SelectItem>
                        <SelectItem value="I10">I10 - Hipertensão essencial</SelectItem>
                        <SelectItem value="E11">E11 - Diabetes mellitus tipo 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={ambulatoryForm.control}
              name="altaAposMedicacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">ALTA APÓS MEDICAÇÃO</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center gap-8"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sim" id="sim" />
                        <Label htmlFor="sim">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao" id="nao" />
                        <Label htmlFor="nao">Não</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setSelectedFormType("")}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      );
    } else {
      return (
        <div className="p-4 mt-4 border rounded-md">
          <p className="text-center text-muted-foreground">Formulário para {formTypes.find(f => f.id === selectedFormType)?.name} em desenvolvimento</p>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setSelectedFormType("")}>
              Cancelar
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                toast({
                  title: "Formulário em desenvolvimento",
                  description: "Esta funcionalidade ainda está sendo implementada",
                });
              }}
            >
              Salvar
            </Button>
          </div>
        </div>
      );
    }
  };
  
  return (
    <div className="p-6 bg-gradient-to-br from-emerald-600/10 via-teal-500/15 to-blue-600/10">
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-semibold">Ficha Clínica</h2>
        
        <Button onClick={handleAddClinicalRecord}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Ficha
        </Button>
      </div>
      
      <div className="space-y-6">
        <Collapsible 
          open={isNewRecordOpen} 
          onOpenChange={setIsNewRecordOpen}
          className="space-y-4"
        >
          <CollapsibleContent>
            <Card className="shadow-md">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Nova Ficha</h3>
                  <Select 
                    value={selectedFormType} 
                    onValueChange={setSelectedFormType}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Escolha uma Ficha de Atendimento" />
                    </SelectTrigger>
                    <SelectContent>
                      {formTypes.map((form) => (
                        <SelectItem key={form.id} value={form.id}>
                          {form.id} - {form.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {renderSelectedForm()}
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
        
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-1/3">
                <Label htmlFor="search" className="mb-1 block">Pesquisar</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="search" 
                    placeholder="Pesquisar..." 
                    value={searchClinicalRecord}
                    onChange={(e) => setSearchClinicalRecord(e.target.value)}
                    className="w-full"
                  />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="w-full md:w-1/4">
                <Label htmlFor="startDate" className="mb-1 block">Data Inicial</Label>
                <Input 
                  id="startDate" 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-1/4">
                <Label htmlFor="endDate" className="mb-1 block">Data Final</Label>
                <Input 
                  id="endDate" 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-1/4">
                <Label htmlFor="speciality" className="mb-1 block">Especialidade</Label>
                <Select 
                  value={selectedSpeciality} 
                  onValueChange={setSelectedSpeciality}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    {specialities.map((spec) => (
                      <SelectItem key={spec.id} value={spec.name}>
                        {spec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Nº</th>
                    <th className="px-4 py-3 text-left font-medium">Data</th>
                    <th className="px-4 py-3 text-left font-medium">Especialidade</th>
                    <th className="px-4 py-3 text-left font-medium">Profissional</th>
                    <th className="px-4 py-3 text-left font-medium">Tipo</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clinicalRecords
                    .filter(record => 
                      (searchClinicalRecord ? 
                        record.number.includes(searchClinicalRecord) || 
                        record.type.toLowerCase().includes(searchClinicalRecord.toLowerCase()) : true) &&
                      (selectedSpeciality ? record.speciality === selectedSpeciality : true)
                    )
                    .map((record, index) => (
                      <tr key={record.id} className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                        <td className="px-4 py-3">{record.number}</td>
                        <td className="px-4 py-3">{record.date}</td>
                        <td className="px-4 py-3">{record.speciality}</td>
                        <td className="px-4 py-3">{record.professional}</td>
                        <td className="px-4 py-3">{record.type}</td>
                        <td className="px-4 py-3">
                          <Badge 
                            variant="outline" 
                            className={
                              record.status === "PENDENTE" 
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-100" 
                                : "bg-green-100 text-green-800 hover:bg-green-100"
                            }
                          >
                            {record.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ClipboardList className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClinicalRecordTab;
