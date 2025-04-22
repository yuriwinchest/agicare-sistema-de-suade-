
import { format, parse } from 'date-fns';

export const formatDateForDatabase = (dateString: string | null): string | null => {
  if (!dateString) return null;
  
  // If already in YYYY-MM-DD format, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  try {
    // Try parsing the date with different possible input formats
    const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
    
    // Check if the parsed date is valid
    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date format:', dateString);
      return null;
    }
    
    // Convert to YYYY-MM-DD format
    return format(parsedDate, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};
