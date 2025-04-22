
import { initializeTables } from './tableInitializer';

export const setupDatabase = async () => {
  try {
    console.log("Verificando e inicializando banco de dados...");
    
    // Initialize the database schema
    const success = await initializeTables();
    return success;
    
  } catch (error) {
    console.error("Erro ao configurar banco de dados:", error);
    return false;
  }
};

// Initialize database when the application starts
export const initializeApp = async () => {
  console.log("Inicializando aplicação e banco de dados...");
  return await setupDatabase();
};
