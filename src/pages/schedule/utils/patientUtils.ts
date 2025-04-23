
import { v4 as uuidv4 } from "uuid";

// Random protocol number for new patient
export const generateProtocolNumber = () => Math.floor(100 + Math.random() * 900);

// Generates a v4 ID
export const generateId = () => uuidv4();

// Converts DD/MM/YYYY or YYYY-MM-DD to YYYY-MM-DD (ISO)
// Used only for local form, not for db inserts (that can use date-fns/parse for rigor)
export const formatDateForDB = (dateStr: string): string | null => {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    let year = parts[2];
    if (year.length < 4) {
      year = parseInt(year) < 50 ? `20${year.padStart(2, "0")}` : `19${year.padStart(2, "0")}`;
    }
    return `${year}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
  }
  return null;
};
