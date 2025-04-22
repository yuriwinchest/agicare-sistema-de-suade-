
// Dados fictícios para o prontuário do paciente (apenas para visualização)

export const patientInfo = {
  id: "P12345",
  name: "João Silva",
  age: 45,
  gender: "Masculino",
  birthDate: "1977-05-15",
  phone: "(11) 98765-4321",
  email: "joao.silva@email.com",
  address: "Rua das Flores, 123 - São Paulo, SP",
  status: "Em Atendimento",
  arrivalTime: "08:30",
  vitalSigns: {
    date: "2023-05-10",
    time: "09:15",
    temperature: 36.5,
    systolicPressure: 120,
    diastolicPressure: 80,
    heartRate: 72,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    painScale: 0,
    bloodGlucose: 95
  },
  allergies: ["Penicilina", "Dipirona"],
  medicalNotes: [
    {
      date: "2023-05-10",
      time: "09:30",
      professional: "Dr. Carlos Oliveira",
      specialty: "Clínico Geral",
      notes: "Paciente relata dor abdominal há 2 dias, localizada em região epigástrica, sem irradiação, de intensidade moderada. Nega febre, vômitos ou alterações intestinais.",
      diagnosis: "Gastrite aguda",
      plan: "Solicitados exames laboratoriais e prescrita medicação sintomática. Orientado retorno em 7 dias."
    }
  ],
  prescriptions: [
    {
      date: "2023-05-10",
      medication: "Omeprazol 20mg",
      dosage: "1 comprimido",
      frequency: "1x ao dia",
      duration: "30 dias",
      instructions: "Tomar em jejum"
    },
    {
      date: "2023-05-10",
      medication: "Simeticona 40mg",
      dosage: "1 comprimido",
      frequency: "3x ao dia",
      duration: "5 dias",
      instructions: "Tomar após as refeições"
    }
  ],
  labTests: [
    {
      date: "2023-05-10",
      type: "Hemograma Completo",
      status: "Solicitado",
      results: null
    },
    {
      date: "2023-05-10",
      type: "Endoscopia Digestiva Alta",
      status: "Agendado",
      results: null
    }
  ]
};

export const availableForms = [
  { id: "anamnese-geral", name: "Anamnese Geral" },
  { id: "anamnese-pediatrica", name: "Anamnese Pediátrica" },
  { id: "anamnese-ginecologica", name: "Anamnese Ginecológica" },
  { id: "anamnese-cardiologica", name: "Anamnese Cardiológica" },
  { id: "anamnese-ortopedica", name: "Anamnese Ortopédica" },
  { id: "anamnese-neurologica", name: "Anamnese Neurológica" }
];

export const clinicalRecords = [
  {
    id: "record1",
    date: "2023-05-10",
    time: "09:30",
    professional: "Dr. Carlos Oliveira",
    specialty: "Clínico Geral",
    notes: "Consulta inicial. Paciente relata dor abdominal há 2 dias.",
    diagnosis: "Gastrite aguda",
    prescription: "Omeprazol 20mg 1x ao dia, Simeticona 40mg 3x ao dia",
    status: "Concluído"
  },
  {
    id: "record2",
    date: "2023-05-17",
    time: "10:15",
    professional: "Dr. Carlos Oliveira",
    specialty: "Clínico Geral",
    notes: "Retorno. Paciente relata melhora dos sintomas após medicação.",
    diagnosis: "Gastrite aguda - em recuperação",
    prescription: "Manter Omeprazol 20mg 1x ao dia por mais 15 dias",
    status: "Agendado"
  }
];

export const specialities = [
  "Clínico Geral",
  "Cardiologia",
  "Dermatologia",
  "Endocrinologia",
  "Gastroenterologia",
  "Ginecologia",
  "Neurologia",
  "Oftalmologia",
  "Ortopedia",
  "Otorrinolaringologia",
  "Pediatria",
  "Psiquiatria",
  "Urologia"
];
