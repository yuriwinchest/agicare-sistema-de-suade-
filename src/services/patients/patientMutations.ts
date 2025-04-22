
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

// Importing from the new location
export {
  updateCollaboratorProfile,
  deleteCollaborator
} from '@/services/collaborators';
