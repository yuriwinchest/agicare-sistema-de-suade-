
import { v4 as uuidv4 } from 'uuid';

export const ensureUUID = (id: string | undefined): string => {
  if (!id) return uuidv4();
  
  // Check if ID is already a valid UUID
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(id)) {
    return id;
  }
  
  return uuidv4();
};
