
import { supabase } from "@/integrations/supabase/client";
import { savePatient } from "./basicMutations";
import { 
  savePatientAdditionalData, 
  savePatientDocument, 
  savePatientAllergy, 
  savePatientNote,
  addPatientLog
} from "../patientAdditionalDataService";

export const saveCompletePatient = async (
  patient: any, 
  additionalData?: any, 
  documents?: any[], 
  allergies?: any[], 
  notes?: string
): Promise<boolean> => {
  try {
    console.log("Iniciando saveCompletePatient com dados:", { patient, additionalData, documents, allergies, notes });
    
    // Garantir que campo reception esteja definido
    if (!patient.reception) {
      patient.reception = "RECEPÇÃO CENTRAL";
    }
    
    // 1. Salvar dados básicos do paciente - Certifica que os dados são formatados corretamente
    const patientData = {
      ...patient,
      // Propriedades importantes
      name: patient.name,
      cpf: patient.cpf || null,
      phone: patient.phone || null,
      email: patient.email || null,
      address: typeof patient.address === 'object' 
        ? JSON.stringify(patient.address) 
        : patient.address,
      birth_date: patient.birth_date || null,
      status: patient.status || 'Agendado',
      person_type: patient.person_type || null,
      gender: patient.gender || null,
      father_name: patient.father_name || null,
      mother_name: patient.mother_name || null,
      specialty: patient.specialty || null,
      professional: patient.professional || null,
      health_plan: patient.health_plan || patient.healthPlan || null,
      attendance_type: patient.specialty || null,
      // Removendo o campo date que estava causando o erro
    };
    
    console.log("Dados formatados para salvar:", patientData);
    
    let { data: savedPatient, error } = await supabase
      .from('patients')
      .insert(patientData)
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao salvar paciente:", error);
      return false;
    }
    
    if (!savedPatient) {
      console.error("Falha ao salvar dados básicos do paciente");
      return false;
    }
    
    console.log("Dados básicos do paciente salvos com sucesso:", savedPatient);
    
    // Verificar se está em modo de demonstração e tratar adequadamente
    const { data: session } = await supabase.auth.getSession();
    const isAuthenticated = !!session?.session;
    
    if (!isAuthenticated) {
      console.log("Modo de demonstração detectado - processando dados adicionais no modo demonstração");
      return true; // Em modo de demonstração, apenas retorna sucesso
    }
    
    // 2. Salvar dados complementares se fornecidos
    if (additionalData) {
      const patientAdditionalData = {
        id: savedPatient.id,
        ...additionalData
      };
      await savePatientAdditionalData(patientAdditionalData);
    }
    
    // 3. Salvar documentos se fornecidos
    if (documents && documents.length > 0) {
      console.log("Salvando documentos:", documents);
      for (const doc of documents) {
        if (doc && doc.documentType && doc.documentNumber) {
          await savePatientDocument({
            patient_id: savedPatient.id,
            document_type: typeof doc.documentType === 'object' ? doc.documentType.value : doc.documentType,
            document_number: typeof doc.documentNumber === 'object' ? doc.documentNumber.value : doc.documentNumber,
            issuing_body: doc.issuingBody || "",
            issue_date: doc.issueDate || null
          });
        }
      }
    }
    
    // 4. Salvar alergias se fornecidas
    if (allergies && allergies.length > 0) {
      console.log("Salvando alergias:", allergies);
      for (const allergy of allergies) {
        if (allergy && allergy.allergyType && allergy.description) {
          await savePatientAllergy({
            patient_id: savedPatient.id,
            allergy_type: typeof allergy.allergyType === 'object' ? allergy.allergyType.value : allergy.allergyType,
            description: allergy.description,
            severity: allergy.severity || "Média"
          });
        }
      }
    }
    
    // 5. Salvar notas se fornecidas
    if (notes) {
      await savePatientNote({
        patient_id: savedPatient.id,
        notes: notes,
        created_by: "Sistema"
      });
    }
    
    // 6. Registrar log de cadastro bem-sucedido
    await addPatientLog({
      patient_id: savedPatient.id,
      action: "Cadastro",
      description: `Paciente cadastrado na ${patient.reception || 'recepção'}.`,
      performed_by: "Sistema"
    });
    
    console.log("Dados completos do paciente salvos com sucesso");
    return true;
  } catch (error) {
    console.error("Erro em saveCompletePatient:", error);
    return false;
  }
};
