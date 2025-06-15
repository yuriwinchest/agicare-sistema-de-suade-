import { Patient, HospitalizedPatient } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { formatDateForDatabase, ensureProperDateFormat } from "../utils/dateUtils";
import { specialties, professionals, healthPlans } from "@/components/patient-reception/constants";

// Função auxiliar para converter ID em nome descritivo
const getSpecialtyNameById = (id: string): string => {
  const specialty = specialties.find(spec => spec.id === id);
  return specialty ? specialty.name : id;
};

const getProfessionalNameById = (id: string): string => {
  const professional = professionals.find(prof => prof.id === id);
  return professional ? professional.name : id;
};

const getHealthPlanNameById = (id: string): string => {
  const healthPlan = healthPlans.find(plan => plan.id === id);
  return healthPlan ? healthPlan.name : id;
};

export const getPatientById = async (id: string): Promise<Patient | null> => {
  try {
    // Get patient data directly from patients table
    const { data: patientData, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching patient:", error);
      return null;
    }
    
    if (!patientData) {
      return null;
    }

    // Get the most recent appointment for this patient
    const { data: appointmentData } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', id)
      .order('date', { ascending: false })
      .order('time', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    console.log("Patient data:", patientData);
    console.log("Appointment data:", appointmentData);
    
    // Use appointment data if available, otherwise use patient data
    const fullPatientData: Patient = {
      ...patientData,
      appointmentTime: appointmentData?.time || patientData.appointment_time || null,
      date: appointmentData?.date || null,
      // Converter IDs para nomes descritivos
      specialty: getSpecialtyNameById(patientData.specialty),
      professional: getProfessionalNameById(patientData.professional),
      health_plan: getHealthPlanNameById(patientData.health_plan)
    };
    
    return fullPatientData;
  } catch (error) {
    console.error("Error in getPatientById:", error);
    return null;
  }
};

export const getAllPatients = async (): Promise<Patient[]> => {
  try {
    console.log("Iniciando getAllPatients");
    // Get all patients
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching patients:", error);
      return [];
    }

    if (!patients || patients.length === 0) {
      return [];
    }

    console.log(`Encontrados ${patients.length} pacientes`);

    // Get all patient IDs to use in our queries
    const patientIds = patients.map(p => p.id);
    
    // Get all appointments for these patients, most recent first
    const { data: appointmentsArray } = await supabase
      .from('appointments')
      .select('*')
      .in('patient_id', patientIds)
      .order('date', { ascending: false })
      .order('time', { ascending: false });
    
    console.log(`Agendamentos encontrados: ${appointmentsArray?.length || 0}`);
    
    // Group appointments by patient_id, keeping only the most recent one
    const appointmentMap: Record<string, any> = {};
    (appointmentsArray || []).forEach(appointment => {
      if (!appointmentMap[appointment.patient_id]) {
        appointmentMap[appointment.patient_id] = appointment;
      }
    });
    
    console.log("appointmentMap:", appointmentMap);

    // Transform data to include additional fields
    const transformedData = patients.map(patient => {
      const patientAny = patient as any;
      const appointment = appointmentMap[patient.id] || {};
      
      // Obter os valores brutos (IDs) para conversão
      const rawSpecialty = patient.specialty || patient.attendance_type || "";
      const rawProfessional = patient.professional || "";
      const rawHealthPlan = patient.health_plan || "";
      
      // Converter IDs para nomes descritivos
      const specialtyName = getSpecialtyNameById(rawSpecialty);
      const professionalName = getProfessionalNameById(rawProfessional);
      const healthPlanName = getHealthPlanNameById(rawHealthPlan);
      
      const transformedPatient = {
        ...patient,
        // Usar os nomes descritivos em vez dos IDs
        specialty: specialtyName || "Não definida",
        professional: professionalName || patient.father_name || "Não definido", 
        health_plan: healthPlanName || "Não informado",
        reception: patient.reception || "RECEPÇÃO CENTRAL",
        // Usar appointment time e date se existirem
        appointmentTime: appointment.time || patient.appointment_time || null,
        date: appointment.date || 
              patientAny.date || 
              (patient.created_at ? ensureProperDateFormat(patient.created_at.split('T')[0]) : "Não agendado"),
        // Incluir o status do appointment se existir
        appointmentStatus: appointment.status || "pending"
      };
      
      return transformedPatient;
    });

    console.log("Dados transformados de pacientes:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("Error in getAllPatients:", error);
    return [];
  }
};

export const getAmbulatoryPatients = async (): Promise<Patient[]> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .in('status', ['Aguardando', 'Em Atendimento', 'Enfermagem']);
      
    if (error) {
      console.error("Error fetching ambulatory patients:", error);
      return [];
    }
    
    // Processar os dados para converter IDs em nomes descritivos
    const processedData = (data || []).map(patient => ({
      ...patient,
      specialty: getSpecialtyNameById(patient.specialty),
      professional: getProfessionalNameById(patient.professional),
      health_plan: getHealthPlanNameById(patient.health_plan)
    }));
    
    return processedData;
  } catch (error) {
    console.error("Error in getAmbulatoryPatients:", error);
    return [];
  }
};

export const getHospitalizedPatients = async (): Promise<HospitalizedPatient[]> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('status', 'Internado');
      
    if (error) {
      console.error("Error fetching hospitalized patients:", error);
      return [];
    }
    
    // Transform Patient data to match HospitalizedPatient type
    const hospitalizedPatients: HospitalizedPatient[] = (data || []).map(patient => ({
      id: patient.id,
      name: patient.name,
      birth_date: patient.birth_date || "",
      unit: patient.mother_name || "Unidade Geral", // Using mother_name field as placeholder for unit
      bed: `${Math.floor(Math.random() * 100) + 1}`, // Generating random bed number for demo
      doctor: patient.father_name || "Dr. Silva", // Using father_name field as placeholder for doctor
      diagnosis: patient.person_type || "Em observação", // Using person_type as placeholder for diagnosis
      phone: patient.phone,
      email: patient.email,
      allergies: [], // Empty array as default
      admissionDate: ensureProperDateFormat(patient.created_at?.split('T')[0]) || "01/01/2023"
    }));
    
    return hospitalizedPatients;
  } catch (error) {
    console.error("Error in getHospitalizedPatients:", error);
    return [];
  }
};
