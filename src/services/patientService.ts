
// Re-export all patient services
export * from './patients/types';
export * from './patients/patientQueries';
export * from './patients/patientMutations';
export * from './patients/patientAdditionalDataService';

// Re-export for backward compatibility
export { getAllPatients as getPatients } from './patients/patientQueries';
