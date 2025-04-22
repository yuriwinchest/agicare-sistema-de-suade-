
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from 'react-hook-form';
import { CollaboratorFormValues } from '@/hooks/useCollaboratorForm';

interface PersonalInfoFieldsProps {
  form: UseFormReturn<CollaboratorFormValues>;
}

export function PersonalInfoFields({ form }: PersonalInfoFieldsProps) {
  return (
    <div className="w-full md:w-2/3 space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input placeholder="Nome do colaborador" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Função</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="doctor">Médico</SelectItem>
                <SelectItem value="nurse">Enfermeiro</SelectItem>
                <SelectItem value="receptionist">Atendente</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
