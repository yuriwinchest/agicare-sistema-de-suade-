
import { supabase } from '../supabaseClient';

const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.log(`Table ${tableName} check result:`, error.message);
      return error.code !== "PGRST116"; // Table doesn't exist error
    }
    
    return true;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};

// These functions now just check if tables exist, but don't try to create them
// Table creation should be done through migrations in Supabase directly
const checkPatientsTable = async () => {
  return await checkTableExists('patients');
};

const checkVitalSignsTable = async () => {
  return await checkTableExists('vital_signs');
};

const checkHealthProfessionalsTable = async () => {
  return await checkTableExists('health_professionals');
};

const checkHealthcareUnitsTable = async () => {
  return await checkTableExists('healthcare_units');
};

export const initializeTables = async (): Promise<boolean> => {
  try {
    console.log("Verificando tabelas do banco de dados...");
    
    const tables = await Promise.all([
      checkPatientsTable(),
      checkVitalSignsTable(),
      checkHealthProfessionalsTable(),
      checkHealthcareUnitsTable(),
    ]);
    
    const [patientsExists, vitalSignsExists, professionalsExists, unitsExists] = tables;
    
    console.log("Status das tabelas:");
    console.log("- Pacientes:", patientsExists ? "Existe" : "Não existe");
    console.log("- Sinais Vitais:", vitalSignsExists ? "Existe" : "Não existe");
    console.log("- Profissionais:", professionalsExists ? "Existe" : "Não existe");
    console.log("- Unidades:", unitsExists ? "Existe" : "Não existe");
    
    return true;
  } catch (error) {
    console.error("Erro ao verificar tabelas:", error);
    return false;
  }
};
