
import { useState } from 'react';

export const useDateMask = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);

  const maskDate = (input: string) => {
    // Remove caracteres não numéricos
    let numbers = input.replace(/\D/g, '');
    
    // Limita a 8 dígitos (ddmmyyyy)
    numbers = numbers.slice(0, 8);
    
    // Adiciona as barras automaticamente
    let formattedDate = numbers;
    
    if (numbers.length >= 2) {
      formattedDate = numbers.slice(0, 2) + (numbers.length > 2 ? '/' : '');
    }
    if (numbers.length >= 4) {
      formattedDate = formattedDate.slice(0, 5) + (numbers.length > 4 ? '/' : '') + numbers.slice(4);
    }
    if (numbers.length > 4) {
      formattedDate = formattedDate.slice(0, 5) + numbers.slice(4, 6) + (numbers.length > 6 ? '/' : '');
    }
    if (numbers.length > 6) {
      formattedDate = formattedDate.slice(0, 8) + numbers.slice(6, 8);
    }

    return formattedDate;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskDate(e.target.value);
    setValue(maskedValue);
    return maskedValue;
  };

  return { value, handleDateChange };
};
