
// Export queries
export {
  getPatientById,
  getAllPatients,
  getAmbulatoryPatients,
  getHospitalizedPatients
} from './queries/patientQueries';

// Export mutations
export {
  saveDraftPatient,
  loadDraftPatient,
  clearDraftPatient
} from './mutations/draftMutations';

export {
  confirmPatientAppointment
} from './mutations/appointmentMutations';

export {
  savePatient
} from './mutations/basicMutations';

// Export types
export type {
  Patient,
  PatientDraft,
  PatientAdditionalData,
  PatientDocument
} from './types';
