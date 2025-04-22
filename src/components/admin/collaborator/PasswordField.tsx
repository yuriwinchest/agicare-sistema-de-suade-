
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
  const isEditing = !!form.getValues().id;
  
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{isEditing ? "Nova Senha (opcional)" : "Senha"}</FormLabel>
          <FormControl>
            <Input 
              type="password" 
              placeholder={isEditing ? "Digite para alterar a senha" : "Digite a senha"} 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
