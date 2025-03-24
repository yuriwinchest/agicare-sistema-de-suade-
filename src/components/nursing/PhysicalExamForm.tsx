
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, FileText, ClipboardCheck } from "lucide-react";

const physicalExamSchema = z.object({
  generalState: z.string().optional(),
  skin: z.string().optional(),
  head: z.string().optional(),
  eyes: z.string().optional(),
  ears: z.string().optional(),
  nose: z.string().optional(),
  mouth: z.string().optional(),
  neck: z.string().optional(),
  chest: z.string().optional(),
  abdomen: z.string().optional(),
  extremities: z.string().optional(),
  neurological: z.string().optional(),
  consciousness: z.string().optional(),
  additional: z.string().optional(),
});

type PhysicalExamFormValues = z.infer<typeof physicalExamSchema>;

interface PhysicalExamFormProps {
  initialValues?: PhysicalExamFormValues;
  onSave: (data: PhysicalExamFormValues) => void;
}

const defaultValues: PhysicalExamFormValues = {
  generalState: "",
  skin: "",
  head: "",
  eyes: "",
  ears: "",
  nose: "",
  mouth: "",
  neck: "",
  chest: "",
  abdomen: "",
  extremities: "",
  neurological: "",
  consciousness: "",
  additional: "",
};

const PhysicalExamForm = ({ initialValues, onSave }: PhysicalExamFormProps) => {
  const [activeTab, setActiveTab] = useState<string>("general");
  
  const form = useForm<PhysicalExamFormValues>({
    resolver: zodResolver(physicalExamSchema),
    defaultValues: initialValues || defaultValues,
  });

  const handleSubmit = (values: PhysicalExamFormValues) => {
    onSave(values);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Exame Físico</h2>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                <Save className="mr-2 h-4 w-4" />
                Salvar Exame
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="general">Geral</TabsTrigger>
                <TabsTrigger value="systems">Sistemas</TabsTrigger>
                <TabsTrigger value="neuro">Neurológico</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <FormField
                  control={form.control}
                  name="generalState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado Geral</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o estado geral do paciente"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="skin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pele e Mucosas</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o estado da pele e mucosas"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="head"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cabeça</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observações sobre a cabeça"
                            className="min-h-16"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="eyes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Olhos</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observações sobre os olhos"
                            className="min-h-16"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="systems" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="chest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tórax</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observações sobre o tórax"
                            className="min-h-20"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="abdomen"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Abdômen</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observações sobre o abdômen"
                            className="min-h-20"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="extremities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Membros</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Observações sobre os membros superiores e inferiores"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="neuro" className="space-y-4">
                <FormField
                  control={form.control}
                  name="neurological"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exame Neurológico</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o exame neurológico"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="consciousness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de Consciência</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrição do nível de consciência"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="additional"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações Adicionais</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Observações adicionais"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PhysicalExamForm;
