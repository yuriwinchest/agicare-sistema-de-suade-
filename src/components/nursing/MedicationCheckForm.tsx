
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Calendar, 
  Clock, 
  Pill, 
  Plus,
  Check,
  X,
  AlertCircle,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const medicationCheckSchema = z.object({
  date: z.string(),
  time: z.string(),
  medication: z.string(),
  dose: z.string(),
  route: z.string(),
  observations: z.string().optional(),
  administered: z.boolean().default(false),
});

type MedicationCheckFormValues = z.infer<typeof medicationCheckSchema>;

interface MedicationCheckFormProps {
  initialValues?: any;
  onSave: (data: any) => void;
}

// Rotas de administração comuns
const administrationRoutes = [
  "Oral",
  "Endovenosa",
  "Intramuscular",
  "Subcutânea",
  "Sublingual",
  "Tópica",
  "Nasal",
  "Ocular",
  "Retal",
  "Vaginal",
  "Inalatória",
];

// Lista de medicações simuladas para testes
const availableMedications = [
  { id: "1", name: "Dipirona", dose: "500mg", route: "Oral" },
  { id: "2", name: "Paracetamol", dose: "750mg", route: "Oral" },
  { id: "3", name: "Metoclopramida", dose: "10mg", route: "Endovenosa" },
  { id: "4", name: "Ondansetrona", dose: "4mg", route: "Endovenosa" },
  { id: "5", name: "Hidrocortisona", dose: "100mg", route: "Endovenosa" },
  { id: "6", name: "Insulina Regular", dose: "10UI", route: "Subcutânea" },
  { id: "7", name: "Morfina", dose: "2mg", route: "Endovenosa" },
  { id: "8", name: "Furosemida", dose: "20mg", route: "Endovenosa" },
  { id: "9", name: "Ranitidina", dose: "50mg", route: "Endovenosa" },
  { id: "10", name: "Soro Fisiológico 0,9%", dose: "500ml", route: "Endovenosa" },
];

const MedicationCheckForm = ({ initialValues, onSave }: MedicationCheckFormProps) => {
  const [medications, setMedications] = useState<any[]>(initialValues?.medications || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedMed, setExpandedMed] = useState<string | null>(null);
  
  const form = useForm<MedicationCheckFormValues>({
    resolver: zodResolver(medicationCheckSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      medication: "",
      dose: "",
      route: "",
      observations: "",
      administered: false,
    },
  });

  const handleSubmit = (values: MedicationCheckFormValues) => {
    const newMedication = {
      id: Date.now().toString(),
      ...values,
      status: values.administered ? "administered" : "pending",
      checkedAt: values.administered ? new Date().toISOString() : null,
    };
    
    const updatedMedications = [...medications, newMedication];
    setMedications(updatedMedications);
    
    // Reset form fields but keep date and time
    form.reset({
      date: values.date,
      time: values.time,
      medication: "",
      dose: "",
      route: "",
      observations: "",
      administered: false,
    });
    
    // Also save updated medications to parent
    onSave({ medications: updatedMedications });
  };
  
  const toggleMedicationDetails = (id: string) => {
    if (expandedMed === id) {
      setExpandedMed(null);
    } else {
      setExpandedMed(id);
    }
  };
  
  const handleDeleteMedication = (id: string) => {
    const updatedMedications = medications.filter(med => med.id !== id);
    setMedications(updatedMedications);
    onSave({ medications: updatedMedications });
  };
  
  const handleAdministerMedication = (id: string) => {
    const updatedMedications = medications.map(med => {
      if (med.id === id) {
        return {
          ...med,
          status: "administered",
          administered: true,
          checkedAt: new Date().toISOString(),
        };
      }
      return med;
    });
    
    setMedications(updatedMedications);
    onSave({ medications: updatedMedications });
  };
  
  const handleSelectMedication = (medicationId: string) => {
    const medication = availableMedications.find(med => med.id === medicationId);
    if (medication) {
      form.setValue("medication", medication.name);
      form.setValue("dose", medication.dose);
      form.setValue("route", medication.route);
    }
  };
  
  const filteredMedications = medications.filter(med =>
    med.medication.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Checagem de Medicamentos</h2>
          <Button className="bg-teal-500 hover:bg-teal-600" onClick={() => onSave({ medications })}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Checagens
          </Button>
        </div>
        
        <div className="mb-6">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Prescrição Médica</h3>
                  <p className="text-xs text-amber-700 mt-1">
                    As medicações prescritas pelo médico aparecem automaticamente na lista abaixo.
                    Você só precisa adicionar manualmente medicações não prescritas ou procedimentos especiais.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="date" {...field} />
                          <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="time" {...field} />
                          <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col space-y-2">
                  <Label>Medicação Prescrita</Label>
                  <Select onValueChange={handleSelectMedication}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma medicação" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMedications.map(med => (
                        <SelectItem key={med.id} value={med.id}>
                          <div className="flex items-center">
                            <Pill className="mr-2 h-4 w-4 text-purple-500" />
                            <span>{med.name} {med.dose}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="medication"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Medicação</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Digite o nome da medicação" 
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dose</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: 500mg, 10ml, etc." 
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="route"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Via de Administração</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a via" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {administrationRoutes.map(route => (
                            <SelectItem key={route} value={route}>
                              {route}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observações sobre a administração..."
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="administered"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Medicação já administrada</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Marque esta opção se a medicação já foi administrada no momento do registro
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" variant="secondary">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Medicação
              </Button>
            </div>
          </form>
        </Form>
        
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">Lista de Medicações</h3>
            
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar medicação..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {medications.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Data/Hora</TableHead>
                    <TableHead>Medicação</TableHead>
                    <TableHead>Dose/Via</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedications.map((med) => (
                    <React.Fragment key={med.id}>
                      <TableRow 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleMedicationDetails(med.id)}
                      >
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
                          {med.status === "administered" ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <Check className="mr-1 h-3 w-3" />
                              Administrado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              <Clock className="mr-1 h-3 w-3" />
                              Pendente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {med.status !== "administered" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAdministerMedication(med.id);
                                }}
                              >
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMedication(med.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                            {expandedMed === med.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      {expandedMed === med.id && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-gray-50 p-4">
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium">Observações:</p>
                                <p className="text-sm text-muted-foreground whitespace-pre-line">
                                  {med.observations || "Sem observações."}
                                </p>
                              </div>
                              
                              {med.status === "administered" && med.checkedAt && (
                                <div className="text-xs text-muted-foreground">
                                  <p>Administrado em: {format(new Date(med.checkedAt), 'dd/MM/yyyy HH:mm')}</p>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-md">
              <Pill className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-muted-foreground">Nenhuma medicação registrada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationCheckForm;
