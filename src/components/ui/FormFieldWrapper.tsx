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

/**
 * FormFieldWrapper
 * Responsabilidade: Componente reutilizável para eliminar duplicação de FormField
 * Princípios: DRY - Evita repetição de padrões de formulário
 */

interface SelectOption {
  value: string;
  label: string;
}

interface FormFieldWrapperProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'select';
  disabled?: boolean;
  required?: boolean;
  options?: SelectOption[];
}

export function FormFieldWrapper({
  form,
  name,
  label,
  placeholder,
  type = 'text',
  disabled = false,
  required = false,
  options = []
}: FormFieldWrapperProps) {
  const renderInput = (field: any) => {
    if (type === 'select' && options.length > 0) {
      return (
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder || `Selecione ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...field}
      />
    );
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            {renderInput(field)}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}