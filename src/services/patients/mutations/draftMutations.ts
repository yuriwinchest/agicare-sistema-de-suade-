
import { PatientDraft } from "../types";

export const saveDraftPatient = (patientDraft: PatientDraft): void => {
  try {
    localStorage.setItem('patientDraft', JSON.stringify(patientDraft));
  } catch (error) {
    console.error("Erro ao salvar rascunho do paciente:", error);
  }
};

export const loadDraftPatient = (): PatientDraft | null => {
  try {
    const draft = localStorage.getItem('patientDraft');
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error("Erro ao carregar rascunho do paciente:", error);
    return null;
  }
};

export const clearDraftPatient = (): void => {
  try {
    localStorage.removeItem('patientDraft');
  } catch (error) {
    console.error("Erro ao limpar rascunho do paciente:", error);
  }
};
