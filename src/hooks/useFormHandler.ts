import { useState, useCallback } from 'react';

/**
 * useFormHandler
 * Responsabilidade: Hook reutilizável para manipulação de formulários
 * Princípios: DRY - Evita duplicação de lógica de formulário
 */

interface UseFormHandlerOptions<T> {
  initialData?: T;
  onSubmit?: (data: T) => void | Promise<void>;
}

export function useFormHandler<T extends Record<string, any>>({
  initialData,
  onSubmit
}: UseFormHandlerOptions<T> = {}) {
  const [data, setData] = useState<T>(initialData || {} as T);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Manipula mudanças em campos simples
  const handleChange = useCallback((field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));

    // Limpa erro do campo quando o usuário digita
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Manipula mudanças em campos aninhados (ex: address.street)
  const handleNestedChange = useCallback((parentField: string, childField: string, value: any) => {
    setData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] || {}),
        [childField]: value
      }
    }));
  }, []);

  // Manipula múltiplas mudanças de uma vez
  const handleBulkChange = useCallback((changes: Partial<T>) => {
    setData(prev => ({ ...prev, ...changes }));
  }, []);

  // Reseta o formulário
  const resetForm = useCallback(() => {
    setData(initialData || {} as T);
    setErrors({});
  }, [initialData]);

  // Submete o formulário
  const handleSubmit = useCallback(async () => {
    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [data, onSubmit]);

  // Valida campo específico
  const validateField = useCallback((field: string, value: any, rules: any[] = []) => {
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
        return false;
      }
    }

    // Remove erro se validação passou
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    return true;
  }, [errors]);

  return {
    data,
    isSubmitting,
    errors,
    handleChange,
    handleNestedChange,
    handleBulkChange,
    resetForm,
    handleSubmit,
    validateField,
    setData,
    setErrors
  };
}