
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

interface PasswordFieldProps {
  form: UseFormReturn<CollaboratorFormValues>;
}

export function PasswordField({ form }: PasswordFieldProps) {
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Senha</FormLabel>
          <FormControl>
            <Input type="password" placeholder="Digite a senha" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
