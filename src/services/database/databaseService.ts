
import { initializeTables } from './tableInitializer';
import { initializeSampleData } from './sampleData';

export const setupDatabase = async () => {
  try {
    console.log("Verificando e inicializando banco de dados...");
    
    // First initialize the database schema
    const success = await initializeTables();
    
    if (success) {
      // Then initialize sample data
      await initializeSampleData();
      return true;
    }
    return false;
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
