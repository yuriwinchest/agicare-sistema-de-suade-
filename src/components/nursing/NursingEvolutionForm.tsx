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
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Save, Clock, Calendar, FileText } from "lucide-react";

const nursingEvolutionSchema = z.object({
  date: z.string(),
  time: z.string(),
  evolution: z.string().min(10, {
    message: "A evolução deve ter pelo menos 10 caracteres.",
  }),
});

type NursingEvolutionFormValues = z.infer<typeof nursingEvolutionSchema>;

interface NursingEvolutionFormProps {
  initialValues?: NursingEvolutionFormValues;
  onSave: (data: NursingEvolutionFormValues) => void;
}

const NursingEvolutionForm = ({ initialValues, onSave }: NursingEvolutionFormProps) => {
  const [evolutions, setEvolutions] = useState<any[]>([
    ...(initialValues?.previousEvolutions || []),
  ]);
  
  const form = useForm<NursingEvolutionFormValues>({
    resolver: zodResolver(nursingEvolutionSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      evolution: initialValues?.evolution || "",
    },
  });

  const handleSubmit = (values: NursingEvolutionFormValues) => {
    onSave(values);
    
    // Add to local state for display
    setEvolutions([
      {
        id: Date.now().toString(),
        ...values,
      },
      ...evolutions,
    ]);
    
    // Reset evolution field but keep date and time
    form.reset({
      date: values.date,
      time: values.time,
      evolution: "",
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Evolução de Enfermagem</h2>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                <Save className="mr-2 h-4 w-4" />
                Salvar Evolução
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            
            <FormField
              control={form.control}
              name="evolution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evolução</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a evolução do paciente..."
                      className="min-h-40"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        
        <div className="mt-8 space-y-4">
          <h3 className="text-md font-medium">Evoluções Anteriores</h3>
          
          {evolutions.length > 0 ? (
            <div className="space-y-4">
              {evolutions.map((ev) => (
                <Card key={ev.id} className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{ev.date}</span>
                        <Clock className="h-4 w-4 mx-1 ml-3" />
                        <span>{ev.time}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-md border">
                      <p className="whitespace-pre-line">{ev.evolution}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-md">
              <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-muted-foreground">Nenhuma evolução registrada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NursingEvolutionForm;
