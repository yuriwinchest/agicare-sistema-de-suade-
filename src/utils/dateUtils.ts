
import { format, parse, isValid } from 'date-fns';

export const formatDateForDatabase = (dateString: string | null): string | null => {
  if (!dateString) return null;
  
  // If the date is already in ISO format (YYYY-MM-DD), return it
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  try {
    // Parse from DD/MM/YYYY format
    const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
    
    // Check if date is valid and within reasonable range (1900-2100)
    if (!isValid(parsedDate)) {
      console.error('Invalid date format:', dateString);
      return null;
    }
    
    const year = parsedDate.getFullYear();
    if (year < 1900 || year > 2100) {
      console.error('Date year out of reasonable range:', year);
      return null;
    }
    
    return format(parsedDate, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

// Add a function to ensure proper date format for display
export const ensureProperDateFormat = (dateString: string): string => {
  // If the input is empty, return empty string
  if (!dateString) return '';
  
  // Remove all non-digit characters
  const digitsOnly = dateString.replace(/\D/g, '');
  
  // Limit to 8 digits total (DDMMYYYY)
  const limitedDigits = digitsOnly.slice(0, 8);
  
  // Format with slashes
  let formattedDate = '';
  if (limitedDigits.length > 4) {
    formattedDate = `${limitedDigits.slice(0, 2)}/${limitedDigits.slice(2, 4)}/${limitedDigits.slice(4, 8)}`;
  } else if (limitedDigits.length > 2) {
    formattedDate = `${limitedDigits.slice(0, 2)}/${limitedDigits.slice(2)}`;
  } else {
    formattedDate = limitedDigits;
  }
  
  return formattedDate;
};

// Validate birth date - check if it's within a reasonable range
export const isValidBirthDate = (dateString: string | null): boolean => {
  if (!dateString) return true; // Null dates are considered valid (optional field)
  
  try {
    // For ISO format
    let parsedDate;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      parsedDate = new Date(dateString);
    } else {
      // For DD/MM/YYYY format
      parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
    }
    
    if (!isValid(parsedDate)) {
      return false;
    }
    
    const year = parsedDate.getFullYear();
    // Reasonable range check - people are unlikely to be over 120 years old or from the future
    const currentYear = new Date().getFullYear();
    return year >= 1900 && year <= currentYear;
    
  } catch {
    return false;
  }
};
