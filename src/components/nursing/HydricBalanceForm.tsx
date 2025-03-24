import { useState } from "react";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Save, 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  Droplet, 
  Plus as DropletPlus, 
  Minus as DropletMinus 
} from "lucide-react";

const hydricBalanceSchema = z.object({
  date: z.string(),
  time: z.string(),
  type: z.string(),
  administeredValue: z.string().optional(),
  eliminationValue: z.string().optional(),
  description: z.string().optional(),
});

type HydricBalanceFormValues = z.infer<typeof hydricBalanceSchema>;

interface HydricBalanceFormProps {
  initialValues?: any;
  onSave: (data: any) => void;
}

const HydricBalanceForm = ({ initialValues, onSave }: HydricBalanceFormProps) => {
  const [balanceEntries, setBalanceEntries] = useState<any[]>(initialValues?.entries || []);
  const [activeTab, setActiveTab] = useState<string>("register");
  
  const form = useForm<HydricBalanceFormValues>({
    resolver: zodResolver(hydricBalanceSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      type: "intake",
      administeredValue: "",
      eliminationValue: "",
      description: "",
    },
  });

  const handleAddEntry = (values: HydricBalanceFormValues) => {
    const newEntry = {
      ...values,
      id: Date.now().toString(),
    };
    
    setBalanceEntries([...balanceEntries, newEntry]);
    form.reset({
      ...form.getValues(),
      administeredValue: "",
      eliminationValue: "",
      description: "",
    });
  };
  
  const handleDeleteEntry = (id: string) => {
    setBalanceEntries(balanceEntries.filter(entry => entry.id !== id));
  };
  
  const handleSaveBalance = () => {
    onSave({
      entries: balanceEntries,
      total: calculateTotals(),
      date: new Date().toISOString(),
    });
  };
  
  const calculateTotals = () => {
    let totalIntake = 0;
    let totalOutput = 0;
    
    balanceEntries.forEach(entry => {
      if (entry.type === "intake" && entry.administeredValue) {
        totalIntake += parseFloat(entry.administeredValue) || 0;
      } else if (entry.type === "output" && entry.eliminationValue) {
        totalOutput += parseFloat(entry.eliminationValue) || 0;
      }
    });
    
    return {
      intake: totalIntake,
      output: totalOutput,
      balance: totalIntake - totalOutput
    };
  };
  
  const totals = calculateTotals();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Balanço Hídrico</h2>
          <Button onClick={handleSaveBalance} className="bg-teal-500 hover:bg-teal-600">
            <Save className="mr-2 h-4 w-4" />
            Salvar Balanço
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="register">Registrar</TabsTrigger>
            <TabsTrigger value="summary">Resumo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="register" className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddEntry)} className="space-y-6">
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
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="intake">
                              <div className="flex items-center">
                                <DropletPlus className="mr-2 h-4 w-4 text-blue-500" />
                                <span>Entrada</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="output">
                              <div className="flex items-center">
                                <DropletMinus className="mr-2 h-4 w-4 text-amber-500" />
                                <span>Saída</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {form.watch("type") === "intake" ? (
                    <FormField
                      control={form.control}
                      name="administeredValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Volume administrado (ml)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field} 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="eliminationValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Volume eliminado (ml)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field} 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: Soro fisiológico, Diurese, etc." 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" variant="secondary">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Registro
                  </Button>
                </div>
              </form>
            </Form>
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Volume (ml)</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balanceEntries.length > 0 ? (
                    balanceEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          {entry.date} {entry.time}
                        </TableCell>
                        <TableCell>
                          {entry.type === "intake" ? (
                            <span className="flex items-center text-blue-600">
                              <DropletPlus className="mr-1 h-4 w-4" />
                              Entrada
                            </span>
                          ) : (
                            <span className="flex items-center text-amber-600">
                              <DropletMinus className="mr-1 h-4 w-4" />
                              Saída
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell>
                          {entry.type === "intake" 
                            ? entry.administeredValue 
                            : entry.eliminationValue
                          }
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteEntry(entry.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Nenhum registro adicionado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <DropletPlus className="h-8 w-8 text-blue-500 mb-2" />
                    <h3 className="text-lg font-medium text-blue-700">Entrada</h3>
                    <p className="text-2xl font-bold text-blue-800">{totals.intake} ml</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <DropletMinus className="h-8 w-8 text-amber-500 mb-2" />
                    <h3 className="text-lg font-medium text-amber-700">Saída</h3>
                    <p className="text-2xl font-bold text-amber-800">{totals.output} ml</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={`${totals.balance >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Droplet className={`h-8 w-8 ${totals.balance >= 0 ? 'text-green-500' : 'text-red-500'} mb-2`} />
                    <h3 className="text-lg font-medium">Balanço</h3>
                    <p className={`text-2xl font-bold ${totals.balance >= 0 ? 'text-green-800' : 'text-red-800'}`}>{totals.balance} ml</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-md font-medium">Cálculo do balanço</h3>
              <p className="text-sm text-muted-foreground">
                O balanço hídrico é a diferença entre a entrada (administrados) e a saída (eliminados) de líquidos.
              </p>
              <p className="text-sm">
                <strong>Entrada total:</strong> {totals.intake} ml<br/>
                <strong>Saída total:</strong> {totals.output} ml<br/>
                <strong>Balanço:</strong> {totals.balance} ml ({totals.balance >= 0 ? 'positivo' : 'negativo'})
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HydricBalanceForm;

