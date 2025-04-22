
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from 'react-hook-form';
import { CollaboratorFormValues } from '@/hooks/useCollaboratorForm';

interface StatusToggleProps {
  form: UseFormReturn<CollaboratorFormValues>;
}

export function StatusToggle({ form }: StatusToggleProps) {
  return (
    <FormField
      control={form.control}
      name="active"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel>Colaborador Ativo</FormLabel>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
