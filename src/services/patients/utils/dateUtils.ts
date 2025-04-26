
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

export const ensureProperDateFormat = (dateString: string | null): string | null => {
  if (!dateString) return null;

  // If already in DD/MM/YYYY format, return as is
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return dateString;
  }

  // If in YYYY-MM-DD format, convert to DD/MM/YYYY
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error converting date format:', error);
      return dateString;
    }
  }

  return dateString;
};

export const isValidBirthDate = (dateString: string | null): boolean => {
  if (!dateString) return true; // Null is considered valid (optional field)
  
  let day, month, year;
  
  // Handle different formats
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    [day, month, year] = dateString.split('/').map(Number);
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    [year, month, day] = dateString.split('-').map(Number);
  } else {
    return false; // Invalid format
  }
  
  // Check if date is valid
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return false; // Invalid date
  }
  
  // Check if year is in reasonable range (1900 to current year)
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) {
    return false;
  }
  
  return true;
};
