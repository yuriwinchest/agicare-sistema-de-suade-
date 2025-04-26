
import { 
  differenceInYears,
  parse,
  parseISO,
  isValid,
  format,
  isFuture,
  isPast,
  isToday,
  differenceInDays,
  addDays,
  subDays
} from 'date-fns';

// Calculate age from birth date
export const calculateAge = (birthDate: string | null): number | null => {
  if (!birthDate) return null;

  try {
    const parsedDate = parseDate(birthDate);
    if (!parsedDate) return null;
    
    return differenceInYears(new Date(), parsedDate);
  } catch (error) {
    console.error('Error calculating age:', error);
    return null;
  }
};

// Parse date from various formats
export const parseDate = (dateString: string | null): Date | null => {
  if (!dateString) return null;

  try {
    // Handle ISO format (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const parsed = parseISO(dateString);
      return isValid(parsed) ? parsed : null;
    }
    
    // Handle DD/MM/YYYY format
    const parsed = parse(dateString, 'dd/MM/yyyy', new Date());
    return isValid(parsed) ? parsed : null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

// Format date for database storage (YYYY-MM-DD)
export const formatDateForDatabase = (dateString: string | null): string | null => {
  if (!dateString) return null;
  
  try {
    const parsedDate = parseDate(dateString);
    if (!parsedDate) return null;
    
    const year = parsedDate.getFullYear();
    if (year < 1900 || year > 2100) {
      console.error('Date year out of reasonable range:', year);
      return null;
    }
    
    return format(parsedDate, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for database:', error);
    return null;
  }
};

// Format date for display (DD/MM/YYYY)
export const formatDateForDisplay = (dateString: string | null): string => {
  if (!dateString) return '';
  
  try {
    const parsedDate = parseDate(dateString);
    if (!parsedDate) return '';
    
    return format(parsedDate, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return '';
  }
};

// Ensure proper date format while typing (DD/MM/YYYY)
export const ensureProperDateFormat = (dateString: string): string => {
  if (!dateString) return '';
  
  const digitsOnly = dateString.replace(/\D/g, '');
  const limitedDigits = digitsOnly.slice(0, 8);
  
  if (limitedDigits.length > 4) {
    return `${limitedDigits.slice(0, 2)}/${limitedDigits.slice(2, 4)}/${limitedDigits.slice(4, 8)}`;
  }
  if (limitedDigits.length > 2) {
    return `${limitedDigits.slice(0, 2)}/${limitedDigits.slice(2)}`;
  }
  return limitedDigits;
};

// Validate birth date
export const isValidBirthDate = (dateString: string | null): boolean => {
  if (!dateString) return true; // Null dates are considered valid (optional field)
  
  try {
    const parsedDate = parseDate(dateString);
    if (!parsedDate) return false;
    
    const year = parsedDate.getFullYear();
    const currentYear = new Date().getFullYear();
    
    return year >= 1900 && year <= currentYear && !isFuture(parsedDate);
  } catch {
    return false;
  }
};

// Check if date is within a given range
export const isDateInRange = (
  dateString: string | null, 
  minDate: Date, 
  maxDate: Date
): boolean => {
  if (!dateString) return false;
  
  try {
    const parsedDate = parseDate(dateString);
    if (!parsedDate) return false;
    
    return isPast(maxDate) && isFuture(minDate);
  } catch {
    return false;
  }
};

// Get relative date description
export const getRelativeDateDescription = (dateString: string | null): string => {
  if (!dateString) return '';
  
  try {
    const parsedDate = parseDate(dateString);
    if (!parsedDate) return '';
    
    if (isToday(parsedDate)) return 'Hoje';
    
    const daysFromToday = differenceInDays(parsedDate, new Date());
    if (daysFromToday === 1) return 'Amanhã';
    if (daysFromToday === -1) return 'Ontem';
    
    return formatDateForDisplay(dateString);
  } catch {
    return '';
  }
};

