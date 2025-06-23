import React from 'react';

/**
 * StandardLabel
 * Responsabilidade: Label padronizado para eliminar duplicação de estilos
 * Princípios: DRY - Evita repetição de classes CSS de labels
 */

interface StandardLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
}

export function StandardLabel({
  children,
  htmlFor,
  required = false,
  optional = false,
  className = ""
}: StandardLabelProps) {
  const baseClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const finalClasses = className ? `${baseClasses} ${className}` : baseClasses;

  return (
    <label htmlFor={htmlFor} className={finalClasses}>
      <span>{children}</span>
      {required && <span className="text-red-500 ml-1">*</span>}
      {optional && <span className="text-xs text-gray-500 ml-2">(opcional)</span>}
    </label>
  );
}