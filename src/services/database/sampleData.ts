import { supabase } from '../supabaseClient';

// Sample data for health professionals
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

// Sample data for healthcare units
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

export const initializeSampleData = async () => {
  try {
    // Check and initialize health professionals
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
      
      const { error: insertError } = await supabase
        .from('health_professionals')
        .insert(sampleProfessionals);
        
      if (insertError) {
        console.error("Erro ao inserir profissionais de amostra:", insertError);
      } else {
        console.log("Profissionais de amostra inseridos com sucesso!");
      }
    }
    
    // Check and initialize healthcare units
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
      
      const { error: insertUnitsError } = await supabase
        .from('healthcare_units')
        .insert(sampleUnits);
        
      if (insertUnitsError) {
        console.error("Erro ao inserir unidades de amostra:", insertUnitsError);
      } else {
        console.log("Unidades de amostra inseridas com sucesso!");
      }
    }
  } catch (error) {
    console.error("Erro ao inicializar dados de amostra:", error);
  }
};
