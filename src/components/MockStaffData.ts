// Dados simulados de colaboradores para desenvolvimento e testes
export interface MockCollaborator {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty?: string;
  department?: string;
  role: string;
  profile_image?: string;
  status: boolean;
}

export const mockCollaborators: MockCollaborator[] = [
  {
    id: "med-001",
    name: "Dr. Ricardo Mendes",
    email: "ricardo.mendes@saludocare.com",
    phone: "(11) 99876-5432",
    specialty: "Cardiologia",
    department: "Clínica Médica",
    role: "médico",
    profile_image: "https://randomuser.me/api/portraits/men/32.jpg",
    status: true
  },
  {
    id: "med-002",
    name: "Dra. Isabela Rocha",
    email: "isabela.rocha@saludocare.com",
    phone: "(11) 99765-4321",
    specialty: "Dermatologia",
    department: "Clínica Médica",
    role: "médico",
    profile_image: "https://randomuser.me/api/portraits/women/45.jpg",
    status: true
  },
  {
    id: "med-003",
    name: "Dr. Fernando Costa",
    email: "fernando.costa@saludocare.com",
    phone: "(11) 99654-3210",
    specialty: "Ortopedia",
    department: "Clínica Médica",
    role: "médico",
    profile_image: "https://randomuser.me/api/portraits/men/41.jpg",
    status: true
  },
  {
    id: "enf-001",
    name: "Márcia Oliveira",
    email: "marcia.oliveira@saludocare.com",
    phone: "(11) 99543-2109",
    department: "Internação",
    role: "enfermagem",
    profile_image: "https://randomuser.me/api/portraits/women/28.jpg",
    status: true
  },
  {
    id: "enf-002",
    name: "Paulo Santos",
    email: "paulo.santos@saludocare.com",
    phone: "(11) 99432-1098",
    department: "Ambulatório",
    role: "enfermagem",
    profile_image: "https://randomuser.me/api/portraits/men/57.jpg",
    status: true
  },
  {
    id: "rec-001",
    name: "Camila Ferreira",
    email: "camila.ferreira@saludocare.com",
    phone: "(11) 99321-0987",
    department: "Recepção Principal",
    role: "recepção",
    profile_image: "https://randomuser.me/api/portraits/women/63.jpg",
    status: true
  },
  {
    id: "rec-002",
    name: "Roberto Alves",
    email: "roberto.alves@saludocare.com",
    phone: "(11) 99210-9876",
    department: "Recepção Ambulatório",
    role: "recepção",
    profile_image: "https://randomuser.me/api/portraits/men/74.jpg",
    status: true
  },
  {
    id: "med-004",
    name: "Dra. Camila Santos",
    email: "camila.santos@saludocare.com",
    phone: "(11) 99109-8765",
    specialty: "Pediatria",
    department: "Clínica Médica",
    role: "médico",
    profile_image: "https://randomuser.me/api/portraits/women/33.jpg",
    status: true
  },
  {
    id: "med-005",
    name: "Dr. Henrique Lima",
    email: "henrique.lima@saludocare.com",
    phone: "(11) 99098-7654",
    specialty: "Neurologia",
    department: "Clínica Médica",
    role: "médico",
    profile_image: "https://randomuser.me/api/portraits/men/22.jpg",
    status: true
  }
]; 