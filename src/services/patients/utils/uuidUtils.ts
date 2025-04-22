
import { v4 as uuidv4 } from 'uuid';

export const ensureUUID = (id: string | undefined): string | undefined => {
  if (!id) return undefined;
  
  // Check if ID is already a valid UUID
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(id)) {
    return id;
  }
  
  // If ID is not a valid UUID, generate a new one
  console.log(`Converting non-UUID ID "${id}" to proper UUID format`);
  return uuidv4();
};
