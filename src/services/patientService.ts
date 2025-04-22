
// Re-export all patient services
export * from './patients/types';
export * from './patients/patientQueries';
export * from './patients/patientMutations';
export * from './patients/patientAdditionalDataService';

// Re-export for backward compatibility
export { getAllPatients as getPatients } from './patients/patientQueries';

// Função para formatar a data do formato DD/MM/YYYY para YYYY-MM-DD
export const formatDateForDatabase = (dateString: string | null): string | null => {
  if (!dateString) return null;
  
  // Verifica se a data já está no formato ISO (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Converte de DD/MM/YYYY para YYYY-MM-DD
  const parts = dateString.split('/');
  if (parts.length === 3) {
    // Garante que o ano tenha 4 dígitos
    let year = parts[2];
    if (year.length < 4) {
      // Adiciona '19' ou '20' dependendo do valor do ano
      year = (parseInt(year) < 50) ? `20${year.padStart(2, '0')}` : `19${year.padStart(2, '0')}`;
    }
    return `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  
  return null;
};
