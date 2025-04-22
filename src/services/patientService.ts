
// Re-export all patient services
export * from './patients/types';
export * from './patients/patientQueries';
export * from './patients/patientMutations';

// Re-export for backward compatibility
export { getAllPatients as getPatients } from './patients/patientQueries';
