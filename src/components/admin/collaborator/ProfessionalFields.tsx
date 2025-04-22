
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import { CollaboratorFormValues } from '@/hooks/useCollaboratorForm';

interface ProfessionalFieldsProps {
  form: UseFormReturn<CollaboratorFormValues>;
}

export function ProfessionalFields({ form }: ProfessionalFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="specialty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Especialidade</FormLabel>
            <FormControl>
              <Input placeholder="Especialidade" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Departamento</FormLabel>
            <FormControl>
              <Input placeholder="Departamento" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
