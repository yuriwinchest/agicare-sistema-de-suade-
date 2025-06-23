/**
 * Form Options Constants
 * Responsabilidade: Constantes reutilizáveis para opções de formulários
 * Princípios: DRY - Evita duplicação de opções em diferentes formulários
 */

export interface SelectOption {
  value: string;
  label: string;
}

// Opções de gênero/sexo
export const GENDER_OPTIONS: SelectOption[] = [
  { value: "Masculino", label: "Masculino" },
  { value: "Feminino", label: "Feminino" },
  { value: "Outro", label: "Outro" },
  { value: "Prefiro não informar", label: "Prefiro não informar" },
];

// Opções de estado civil
export const MARITAL_STATUS_OPTIONS: SelectOption[] = [
  { value: "solteiro", label: "Solteiro(a)" },
  { value: "casado", label: "Casado(a)" },
  { value: "divorciado", label: "Divorciado(a)" },
  { value: "viuvo", label: "Viúvo(a)" },
  { value: "uniao_estavel", label: "União Estável" },
];

// Opções de escolaridade
export const EDUCATION_OPTIONS: SelectOption[] = [
  { value: "fundamental_incompleto", label: "Fundamental Incompleto" },
  { value: "fundamental_completo", label: "Fundamental Completo" },
  { value: "medio_incompleto", label: "Médio Incompleto" },
  { value: "medio_completo", label: "Médio Completo" },
  { value: "superior_incompleto", label: "Superior Incompleto" },
  { value: "superior_completo", label: "Superior Completo" },
  { value: "pos_graduacao", label: "Pós-graduação" },
];

// Opções de função/cargo para colaboradores
export const ROLE_OPTIONS: SelectOption[] = [
  { value: "doctor", label: "Médico" },
  { value: "nurse", label: "Enfermeiro" },
  { value: "receptionist", label: "Atendente" },
  { value: "admin", label: "Administrador" },
  { value: "technician", label: "Técnico" },
  { value: "other", label: "Outro" },
];

// Opções de especialidades médicas
export const SPECIALTY_OPTIONS: SelectOption[] = [
  { value: "clinica_geral", label: "Clínica Geral" },
  { value: "cardiologia", label: "Cardiologia" },
  { value: "dermatologia", label: "Dermatologia" },
  { value: "ginecologia", label: "Ginecologia" },
  { value: "neurologia", label: "Neurologia" },
  { value: "ortopedia", label: "Ortopedia" },
  { value: "pediatria", label: "Pediatria" },
  { value: "psiquiatria", label: "Psiquiatria" },
  { value: "urologia", label: "Urologia" },
];

// Opções de tipo de atendimento
export const ATTENDANCE_TYPE_OPTIONS: SelectOption[] = [
  { value: "consulta", label: "Consulta" },
  { value: "retorno", label: "Retorno" },
  { value: "emergencia", label: "Emergência" },
  { value: "exame", label: "Exame" },
  { value: "procedimento", label: "Procedimento" },
];

// Opções de formas de pagamento
export const PAYMENT_METHOD_OPTIONS: SelectOption[] = [
  { value: "dinheiro", label: "Dinheiro" },
  { value: "cartao_credito", label: "Cartão de Crédito" },
  { value: "cartao_debito", label: "Cartão de Débito" },
  { value: "pix", label: "PIX" },
  { value: "convenio", label: "Convênio" },
  { value: "particular", label: "Particular" },
];

// Estados brasileiros (principais)
export const STATES_OPTIONS: SelectOption[] = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];