import React from 'react';
import { FormFieldWrapper } from '@/components/ui/FormFieldWrapper';
import { UseFormReturn } from 'react-hook-form';
import { CollaboratorFormValues } from '@/hooks/useCollaboratorForm';
import { ROLE_OPTIONS } from '@/constants/formOptions';

/**
 * PersonalInfoFields
 * Responsabilidade: Campos de informações pessoais para colaboradores
 * Princípios: DRY - Usa componentes e constantes reutilizáveis
 */

interface PersonalInfoFieldsProps {
  form: UseFormReturn<CollaboratorFormValues>;
  disabled?: boolean;
}

export function PersonalInfoFields({ form, disabled = false }: PersonalInfoFieldsProps) {
  return (
    <div className="w-full md:w-2/3 space-y-4">
      <FormFieldWrapper
        form={form}
        name="name"
        label="Nome Completo"
        placeholder="Nome do colaborador"
        disabled={disabled}
        required
      />

      <FormFieldWrapper
        form={form}
        name="role"
        label="Função"
        type="select"
        placeholder="Selecione a função"
        options={ROLE_OPTIONS}
        disabled={disabled}
        required
      />
    </div>
  );
}
