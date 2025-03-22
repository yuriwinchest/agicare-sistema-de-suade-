
// Mock patient data
export const patientInfo = {
  id: "001",
  name: "Carlos Ferreira",
  age: 42,
  birthdate: "10/08/1980",
  gender: "Masculino",
  allergies: [
    { substance: "Penicilina", reaction: "Urticária e prurido" },
    { substance: "Dipirona", reaction: "Angioedema" }
  ],
  vitalSigns: [
    { date: "19/05/2023 09:30", temperature: "38.5°C", pressure: "130/85", pulse: "88bpm", respiratory: "18rpm", oxygen: "96%" },
    { date: "19/05/2023 08:15", temperature: "38.7°C", pressure: "135/90", pulse: "92bpm", respiratory: "20rpm", oxygen: "95%" }
  ],
  medicalNotes: [
    { 
      id: "note1", 
      date: "19/05/2023 09:30", 
      title: "Evolução Médica", 
      doctor: "Dr. Ana Silva", 
      content: "Paciente relata febre há 3 dias, acompanhada de dor abdominal difusa e vômitos. Ao exame: abdome doloroso à palpação em quadrante inferior direito, com sinal de Blumberg positivo. Suspeita de apendicite aguda, solicitados exames complementares." 
    },
    { 
      id: "note2", 
      date: "19/05/2023 08:15", 
      title: "Avaliação Inicial", 
      doctor: "Dr. Ana Silva", 
      content: "Paciente deu entrada no PS com queixa de febre e dor abdominal. Iniciada investigação diagnóstica." 
    }
  ],
  labTests: [
    { id: "exam1", date: "19/05/2023 10:00", name: "Hemograma Completo", status: "Pendente" },
    { id: "exam2", date: "19/05/2023 10:00", name: "PCR", status: "Pendente" },
    { id: "exam3", date: "19/05/2023 10:00", name: "Tomografia de Abdome", status: "Agendado" }
  ],
  prescriptions: [
    { 
      id: "presc1", 
      date: "19/05/2023 09:45", 
      doctor: "Dr. Ana Silva",
      items: [
        { medication: "Dipirona", dose: "1g", frequency: "6/6h", route: "EV" },
        { medication: "Ondansetrona", dose: "4mg", frequency: "8/8h", route: "EV" },
        { medication: "Soro Fisiológico 0,9%", dose: "1000ml", frequency: "12/12h", route: "EV" }
      ],
      nursingInstructions: [
        { instruction: "Monitorar temperatura", frequency: "4/4h" },
        { instruction: "Controle de diurese", frequency: "Contínuo" }
      ],
      diet: "Dieta zero até liberação médica"
    }
  ]
};

// Mock available medical forms
export const availableForms = [
  { id: "form1", title: "Evolução Médica" },
  { id: "form2", title: "Anamnese" },
  { id: "form3", title: "Exame Físico" },
  { id: "form4", title: "Laudo para Solicitação de AIH" },
  { id: "form5", title: "Receituário" },
  { id: "form6", title: "Atestado Médico" },
];

// Mock available medications
export const availableMedications = [
  { id: "med1", name: "Dipirona" },
  { id: "med2", name: "Ondansetrona" },
  { id: "med3", name: "Paracetamol" },
  { id: "med4", name: "Ibuprofeno" },
  { id: "med5", name: "Amoxicilina" },
  { id: "med6", name: "Metoclopramida" },
  { id: "med7", name: "Soro Fisiológico 0,9%" },
  { id: "med8", name: "Soro Glicosado 5%" },
];

// Mock available nursing instructions
export const availableNursingInstructions = [
  { id: "instr1", name: "Monitorar temperatura" },
  { id: "instr2", name: "Controle de diurese" },
  { id: "instr3", name: "Monitorar pressão arterial" },
  { id: "instr4", name: "Monitorar saturação de O2" },
  { id: "instr5", name: "Curativo simples" },
  { id: "instr6", name: "Aplicação de compressa fria" },
];

// Mock available diets
export const availableDiets = [
  { id: "diet1", name: "Dieta zero" },
  { id: "diet2", name: "Dieta líquida" },
  { id: "diet3", name: "Dieta branda" },
  { id: "diet4", name: "Dieta geral" },
  { id: "diet5", name: "Dieta hipossódica" },
  { id: "diet6", name: "Dieta para diabéticos" },
];

// Mock available exams
export const availableExams = {
  laboratory: [
    { id: "lab1", name: "Hemograma Completo" },
    { id: "lab2", name: "PCR" },
    { id: "lab3", name: "VHS" },
    { id: "lab4", name: "Glicemia" },
    { id: "lab5", name: "Ureia e Creatinina" },
    { id: "lab6", name: "Eletrólitos" },
    { id: "lab7", name: "Coagulograma" },
    { id: "lab8", name: "Função Hepática" },
  ],
  imaging: [
    { id: "img1", name: "Raio-X de Tórax" },
    { id: "img2", name: "Raio-X de Abdome" },
    { id: "img3", name: "Ultrassonografia Abdominal" },
    { id: "img4", name: "Tomografia de Abdome" },
    { id: "img5", name: "Tomografia de Tórax" },
    { id: "img6", name: "Ressonância Magnética" },
  ],
  cardiological: [
    { id: "card1", name: "Eletrocardiograma" },
    { id: "card2", name: "Ecocardiograma" },
    { id: "card3", name: "Teste Ergométrico" },
    { id: "card4", name: "Holter 24h" },
  ],
};

// Mock clinical records
export const clinicalRecords = [
  { id: "10001", number: "12345", date: "02/05/2023 14:39", speciality: "CARDIOLOGIA", professional: "MÉDICO PADRÃO", type: "FICHA DE ATENDIMENTO", status: "FINALIZADA" },
  { id: "10002", number: "21576", date: "05/04/2023 10:15", speciality: "ANESTESIOLOGIA", professional: "MÉDICO PADRÃO", type: "FICHA DE ATENDIMENTO", status: "PENDENTE" },
  { id: "10003", number: "31255", date: "20/03/2023 08:54", speciality: "CARDIOLOGIA", professional: "MÉDICO PADRÃO", type: "FICHA DE EVOLUÇÃO", status: "FINALIZADA" },
  { id: "10004", number: "41236", date: "15/02/2023 16:30", speciality: "CLÍNICA MÉDICA", professional: "MÉDICO PADRÃO", type: "FICHA DE ATENDIMENTO", status: "FINALIZADA" },
  { id: "10005", number: "51377", date: "10/01/2023 09:20", speciality: "NEUROLOGIA", professional: "MÉDICO PADRÃO", type: "FICHA DE AVALIAÇÃO", status: "FINALIZADA" },
  { id: "10006", number: "61238", date: "05/12/2022 11:45", speciality: "CARDIOLOGIA", professional: "MÉDICO PADRÃO", type: "FICHA DE ATENDIMENTO", status: "FINALIZADA" },
  { id: "10007", number: "71288", date: "20/11/2022 13:10", speciality: "CLÍNICA MÉDICA", professional: "MÉDICO PADRÃO", type: "FICHA DE EVOLUÇÃO", status: "FINALIZADA" },
  { id: "10008", number: "81356", date: "15/10/2022 15:25", speciality: "ANESTESIOLOGIA", professional: "MÉDICO PADRÃO", type: "FICHA DE AVALIAÇÃO", status: "FINALIZADA" },
  { id: "10009", number: "90408", date: "28/09/2022 10:50", speciality: "MÉDICO PEDIATRA NEONATOLOGISTA JÚNIOR", professional: "MÉDICO PADRÃO", type: "FICHA TÉCNICA", status: "FINALIZADA" },
  { id: "10010", number: "12405", date: "08/08/2022 14:30", speciality: "ORTOPEDIA / TRAUMATOLOGIA", professional: "MÉDICO PADRÃO", type: "FICHA CLÍNICA", status: "FINALIZADA" },
];

// Available specialities for filtering
export const specialities = [
  { id: "spec1", name: "CARDIOLOGIA" },
  { id: "spec2", name: "ANESTESIOLOGIA" },
  { id: "spec3", name: "CLÍNICA MÉDICA" },
  { id: "spec4", name: "NEUROLOGIA" },
  { id: "spec5", name: "ORTOPEDIA / TRAUMATOLOGIA" },
  { id: "spec6", name: "PEDIATRIA" },
];
