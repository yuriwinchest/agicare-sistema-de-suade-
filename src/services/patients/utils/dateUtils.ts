
import { format, parse } from 'date-fns';

export const formatDateForDatabase = (dateString: string | null): string | null => {
  if (!dateString) return null;
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  try {
    const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
    
    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date format:', dateString);
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
