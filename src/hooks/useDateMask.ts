
import { useState } from 'react';

export const useDateMask = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);

  const maskDate = (input: string) => {
    // Remove any non-digit characters
    let numbers = input.replace(/\D/g, '');
    
    // Limit to 8 digits (ddmmyyyy)
    numbers = numbers.slice(0, 8);
    
    // Add slashes for date format
    if (numbers.length >= 4) {
      numbers = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4);
    } else if (numbers.length >= 2) {
      numbers = numbers.slice(0, 2) + '/' + numbers.slice(2);
    }
    
    return numbers;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskDate(e.target.value);
    setValue(maskedValue);
    return maskedValue; // Return the masked value
  };

  return { value, handleDateChange };
};
