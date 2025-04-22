
// Dados fictícios para o prontuário do paciente (apenas para visualização)

export const patientInfo = {
  id: "P12345",
  name: "João Silva",
  age: 45,
  gender: "Masculino",
  birthdate: "1977-05-15",
  phone: "(11) 98765-4321",
  email: "joao.silva@email.com",
  address: "Rua das Flores, 123 - São Paulo, SP",
  status: "Em Atendimento",
  arrivalTime: "08:30",
  vitalSigns: [
    {
      date: "2023-05-10",
      temperature: "36.5",
      pressure: "120/80",
      pulse: "72",
      respiratory: "16",
      oxygen: "98%"
    }
  ],
  allergies: [
    { substance: "Penicilina", reaction: "Urticária" },
    { substance: "Dipirona", reaction: "Edema" }
  ],
  medicalNotes: [
    {
      id: "note1",
      date: "2023-05-10",
      title: "Consulta Inicial",
      doctor: "Dr. Carlos Oliveira",
      content: "Paciente relata dor abdominal há 2 dias, localizada em região epigástrica, sem irradiação, de intensidade moderada. Nega febre, vômitos ou alterações intestinais. Diagnóstico: Gastrite aguda."
    }
  ],
  prescriptions: [
    {
      id: "presc1",
      date: "2023-05-10",
      doctor: "Dr. Carlos Oliveira",
      items: [
        { medication: "Omeprazol", dose: "20mg", frequency: "1x ao dia", route: "Oral" },
        { medication: "Simeticona", dose: "40mg", frequency: "3x ao dia", route: "Oral" }
      ],
      nursingInstructions: [
        { instruction: "Monitorar sintomas gástricos", frequency: "A cada 8 horas" }
      ],
      diet: "Branda, evitar alimentos condimentados"
    }
  ],
  labTests: [
    {
      id: "exam1",
      date: "2023-05-10",
      name: "Hemograma Completo",
      status: "Solicitado"
    },
    {
      id: "exam2",
      date: "2023-05-10",
      name: "Endoscopia Digestiva Alta",
      status: "Agendado"
    }
  ]
};

export const availableForms = [
  { id: "anamnese-geral", title: "Anamnese Geral" },
  { id: "anamnese-pediatrica", title: "Anamnese Pediátrica" },
  { id: "anamnese-ginecologica", title: "Anamnese Ginecológica" },
  { id: "anamnese-cardiologica", title: "Anamnese Cardiológica" },
  { id: "anamnese-ortopedica", title: "Anamnese Ortopédica" },
  { id: "anamnese-neurologica", title: "Anamnese Neurológica" }
];

export const clinicalRecords = [
  {
    id: "record1",
    number: "CR001",
    date: "2023-05-10",
    speciality: "Clínico Geral",
    professional: "Dr. Carlos Oliveira",
    type: "Consulta inicial",
    status: "Concluído"
  },
  {
    id: "record2",
    number: "CR002",
    date: "2023-05-17",
    speciality: "Clínico Geral",
    professional: "Dr. Carlos Oliveira",
    type: "Retorno",
    status: "Agendado"
  }
];

export const specialities = [
  { id: "clin-geral", name: "Clínico Geral" },
  { id: "cardio", name: "Cardiologia" },
  { id: "dermato", name: "Dermatologia" },
  { id: "endocrino", name: "Endocrinologia" },
  { id: "gastro", name: "Gastroenterologia" },
  { id: "gineco", name: "Ginecologia" },
  { id: "neuro", name: "Neurologia" },
  { id: "oftalmo", name: "Oftalmologia" },
  { id: "ortopedia", name: "Ortopedia" },
  { id: "otorrino", name: "Otorrinolaringologia" },
  { id: "pediatria", name: "Pediatria" },
  { id: "psiquiatria", name: "Psiquiatria" },
  { id: "urologia", name: "Urologia" }
];
