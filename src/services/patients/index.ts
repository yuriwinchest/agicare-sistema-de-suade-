
// Export queries
export {
  getPatientById,
  getAllPatients,
  getAmbulatoryPatients,
  getHospitalizedPatients
} from './queries/patientQueries';

export {
  getActiveAppointments,
  getPatientAppointments
} from './queries/appointmentQueries';

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

export {
  saveCompletePatient
} from './mutations/completeMutations';

// Export types
export type {
  Patient,
  PatientDraft,
  PatientAdditionalData,
  PatientDocument,
  HospitalizedPatient,
  PatientAllergy,
  PatientNote,
  PatientLog
} from './types';
