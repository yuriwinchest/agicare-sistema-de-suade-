import React from 'react';
import { FormFieldWrapper } from '@/components/ui/FormFieldWrapper';
import { UseFormReturn } from 'react-hook-form';
import { CollaboratorFormValues } from '@/hooks/useCollaboratorForm';

/**
 * ContactFields
 * Responsabilidade: Campos de contato para colaboradores
 * Princípios: DRY - Usa componentes reutilizáveis em vez de duplicar código
 */

interface ContactFieldsProps {
  form: UseFormReturn<CollaboratorFormValues>;
  disabled?: boolean;
}

export function ContactFields({ form, disabled = false }: ContactFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormFieldWrapper
        form={form}
        name="email"
        label="Email"
        type="email"
        placeholder="email@exemplo.com"
        disabled={disabled}
        required
      />

      <FormFieldWrapper
        form={form}
        name="phone"
        label="Telefone"
        type="tel"
        placeholder="(00) 00000-0000"
        disabled={disabled}
        required
      />
    </div>
  );
}
