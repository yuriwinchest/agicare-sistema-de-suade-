
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { isValidBirthDate } from "@/utils/dateUtils";

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (value: string) => void;
  showValidation?: boolean;
}

export function DateInput({ 
  value, 
  onChange, 
  className, 
  showValidation = true,
  ...props 
}: DateInputProps) {
  const [inputValue, setInputValue] = useState(value || "");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Remove non-numeric characters
    let numbersOnly = rawValue.replace(/\D/g, '');
    
    // Limit to 8 digits (DDMMYYYY)
    numbersOnly = numbersOnly.slice(0, 8);
    
    // Format with slashes
    let formatted = numbersOnly;
    
    if (numbersOnly.length > 0) {
      formatted = numbersOnly.slice(0, Math.min(2, numbersOnly.length));
      
      if (numbersOnly.length > 2) {
        formatted += '/' + numbersOnly.slice(2, Math.min(4, numbersOnly.length));
        
        if (numbersOnly.length > 4) {
          formatted += '/' + numbersOnly.slice(4, 8);
        }
      }
    }
    
    // Update local state
    setInputValue(formatted);
    
    // Call parent's onChange with the formatted value
    onChange(formatted);
  };

  const isDateValid = !inputValue || isValidBirthDate(inputValue);
  
  return (
    <>
      <Input
        type="text"
        value={inputValue}
        onChange={handleChange}
        maxLength={10}
        placeholder="DD/MM/AAAA"
        className={cn(
          className,
          showValidation && !isDateValid && "border-red-500"
        )}
        {...props}
      />
      {showValidation && !isDateValid && (
        <p className="text-red-500 text-sm mt-1">
          Data inválida. Utilize formato DD/MM/AAAA com ano entre 1900 e hoje.
        </p>
      )}
    </>
  );
}
