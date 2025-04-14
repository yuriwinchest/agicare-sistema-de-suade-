
import { supabase } from './supabaseClient';
import { initializeDatabase } from './supabaseClient';

// Initialize sample data for healthcare professionals if table is empty
export const initializeSampleData = async () => {
  try {
    // Check if we already have health professionals
    const { data: professionals, error } = await supabase
      .from('health_professionals')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error("Erro ao verificar profissionais de saúde:", error);
      return;
    }
    
    // If no professionals exist, add sample data
    if (professionals && professionals.length === 0) {
      console.log("Adicionando dados de amostra para profissionais de saúde...");
      
      const sampleProfessionals = [
        { 
          name: 'Dr. João Silva', 
          specialty: 'Clínico Geral', 
          license_number: 'CRM 12345',
          email: 'joao.silva@agicare.com',
          phone: '(11) 98765-4321',
          active: true
        },
        { 
          name: 'Dra. Maria Oliveira', 
          specialty: 'Pediatria', 
          license_number: 'CRM 23456',
          email: 'maria.oliveira@agicare.com',
          phone: '(11) 97654-3210',
          active: true 
        },
        { 
          name: 'Dr. Carlos Santos', 
          specialty: 'Ortopedia', 
          license_number: 'CRM 34567',
          email: 'carlos.santos@agicare.com',
          phone: '(11) 96543-2109',
          active: true 
        },
        { 
          name: 'Dra. Ana Ferreira', 
          specialty: 'Cardiologia', 
          license_number: 'CRM 45678',
          email: 'ana.ferreira@agicare.com',
          phone: '(11) 95432-1098',
          active: true 
        },
        { 
          name: 'Dr. Paulo Mendes', 
          specialty: 'Neurologia', 
          license_number: 'CRM 56789',
          email: 'paulo.mendes@agicare.com',
          phone: '(11) 94321-0987',
          active: true 
        }
      ];
      
      const { error: insertError } = await supabase
        .from('health_professionals')
        .insert(sampleProfessionals);
        
      if (insertError) {
        console.error("Erro ao inserir profissionais de amostra:", insertError);
      } else {
        console.log("Profissionais de amostra inseridos com sucesso!");
      }
    }
    
    // Check if we have any healthcare units
    const { data: units, error: unitsError } = await supabase
      .from('healthcare_units')
      .select('id')
      .limit(1);
      
    if (unitsError) {
      console.error("Erro ao verificar unidades de saúde:", unitsError);
      return;
    }
    
    // If no units exist, add sample data
    if (units && units.length === 0) {
      console.log("Adicionando dados de amostra para unidades de saúde...");
      
      const sampleUnits = [
        { 
          name: 'Unidade Central', 
          address: 'Av. Paulista, 1000, São Paulo - SP',
          phone: '(11) 3456-7890'
        },
        { 
          name: 'Unidade Norte', 
          address: 'Rua Voluntários da Pátria, 500, São Paulo - SP',
          phone: '(11) 3456-7891'
        },
        { 
          name: 'Unidade Sul', 
          address: 'Av. Santo Amaro, 2000, São Paulo - SP',
          phone: '(11) 3456-7892'
        }
      ];
      
      const { error: insertUnitsError } = await supabase
        .from('healthcare_units')
        .insert(sampleUnits);
        
      if (insertUnitsError) {
        console.error("Erro ao inserir unidades de amostra:", insertUnitsError);
      } else {
        console.log("Unidades de amostra inseridas com sucesso!");
      }
    }
    
    // Check if we have any schedules
    const { data: schedules, error: schedulesError } = await supabase
      .from('schedules')
      .select('id')
      .limit(1);
      
    if (schedulesError) {
      console.error("Erro ao verificar agendas:", schedulesError);
      return;
    }
    
    // Get professional IDs for sample schedules
    if (schedules && schedules.length === 0) {
      const { data: profIds, error: profIdsError } = await supabase
        .from('health_professionals')
        .select('id')
        .limit(5);
        
      if (profIdsError || !profIds || profIds.length === 0) {
        console.error("Erro ao obter IDs de profissionais para agendas de amostra:", profIdsError);
        return;
      }
      
      console.log("Adicionando dados de amostra para agendas...");
      
      // Create sample schedules for each professional (weekdays only)
      const sampleSchedules = [];
      
      for (const prof of profIds) {
        // Monday to Friday (1-5)
        for (let day = 1; day <= 5; day++) {
          sampleSchedules.push({
            professional_id: prof.id,
            day_of_week: day,
            start_time: "08:00",
            end_time: "17:00",
            break_start: "12:00",
            break_end: "13:00",
            appointment_duration: 30 // 30 minutos por consulta
          });
        }
      }
      
      const { error: insertSchedulesError } = await supabase
        .from('schedules')
        .insert(sampleSchedules);
        
      if (insertSchedulesError) {
        console.error("Erro ao inserir agendas de amostra:", insertSchedulesError);
      } else {
        console.log("Agendas de amostra inseridas com sucesso!");
      }
    }
  } catch (error) {
    console.error("Erro ao inicializar dados de amostra:", error);
  }
};

// Main function to initialize the database and sample data
export const setupDatabase = async () => {
  try {
    // First initialize the database schema
    const success = await initializeDatabase();
    
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
