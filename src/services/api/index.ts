import { supabase } from "@/integrations/supabase/client";
import { specialties, professionals, healthPlans } from "@/components/patient-reception/constants";

// Implementação de cache simples
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number; // tempo em ms
}

class ApiCache {
  private cache: Record<string, CacheItem<any>> = {};

  // Armazena um item no cache
  set<T>(key: string, data: T, expiry: number = 60000): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
      expiry
    };
  }

  // Recupera um item do cache
  get<T>(key: string): T | null {
    const item = this.cache[key];
    if (!item) return null;

    // Verifica se o item expirou
    if (Date.now() - item.timestamp > item.expiry) {
      delete this.cache[key];
      return null;
    }

    return item.data as T;
  }

  // Limpa o cache completamente ou um item específico
  clear(key?: string): void {
    if (key) {
      delete this.cache[key];
    } else {
      this.cache = {};
    }
  }

  // Verifica se um item está no cache e válido
  has(key: string): boolean {
    const item = this.cache[key];
    if (!item) return false;
    if (Date.now() - item.timestamp > item.expiry) {
      delete this.cache[key];
      return false;
    }
    return true;
  }
}

// Instância global do cache
const apiCache = new ApiCache();

// Helpers para mapear IDs para nomes
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

// API de Pacientes
export const PatientsApi = {
  // Obter todos os pacientes com suporte a cache
  async getAll(forceRefresh: boolean = false) {
    const cacheKey = 'patients_all';
    
    // Se não forçar atualização e tiver no cache, retorna do cache
    if (!forceRefresh && apiCache.has(cacheKey)) {
      console.log("Recuperando pacientes do cache");
      return apiCache.get(cacheKey);
    }

    console.log("Buscando pacientes do banco de dados");
    try {
      // Obter pacientes do Supabase
      const { data: patients, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Erro ao buscar pacientes:", error);
        return [];
      }

      if (!patients || patients.length === 0) {
        return [];
      }

      // Obter IDs dos pacientes
      const patientIds = patients.map(p => p.id);
      
      // Buscar agendamentos relacionados
      const { data: appointmentsArray } = await supabase
        .from('appointments')
        .select('*')
        .in('patient_id', patientIds)
        .order('date', { ascending: false })
        .order('time', { ascending: false });
      
      // Agrupar agendamentos por paciente (apenas o mais recente)
      const appointmentMap: Record<string, any> = {};
      (appointmentsArray || []).forEach(appointment => {
        if (!appointmentMap[appointment.patient_id]) {
          appointmentMap[appointment.patient_id] = appointment;
        }
      });
      
      // Transformar dados com nomes descritivos
      const transformedData = patients.map(patient => {
        const patientAny = patient as any;
        const appointment = appointmentMap[patient.id] || {};
        
        // Converter IDs para nomes
        const rawSpecialty = patient.specialty || patient.attendance_type || "";
        const rawProfessional = patient.professional || "";
        const rawHealthPlan = patient.health_plan || "";
        
        const specialtyName = getSpecialtyNameById(rawSpecialty);
        const professionalName = getProfessionalNameById(rawProfessional);
        const healthPlanName = getHealthPlanNameById(rawHealthPlan);
        
        return {
          ...patient,
          specialty: specialtyName || "Não definida",
          professional: professionalName || patient.father_name || "Não definido", 
          health_plan: healthPlanName || "Não informado",
          reception: patient.reception || "RECEPÇÃO CENTRAL",
          appointmentTime: appointment.time || patient.appointment_time || null,
          date: appointment.date || patientAny.date || 
                (patient.created_at ? patient.created_at.split('T')[0] : "Não agendado"),
          appointmentStatus: appointment.status || "pending"
        };
      });

      // Salvar no cache com expiração de 5 minutos
      apiCache.set(cacheKey, transformedData, 5 * 60 * 1000);
      return transformedData;
    } catch (error) {
      console.error("Erro na API de pacientes:", error);
      return [];
    }
  },

  // Obter um paciente pelo ID
  async getById(id: string) {
    const cacheKey = `patient_${id}`;
    
    if (apiCache.has(cacheKey)) {
      return apiCache.get(cacheKey);
    }

    try {
      // Buscar dados do paciente
      const { data: patientData, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (error || !patientData) {
        console.error("Erro ao buscar paciente:", error);
        return null;
      }
      
      // Buscar agendamento mais recente
      const { data: appointmentData } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', id)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      // Montar dados completos
      const fullPatientData = {
        ...patientData,
        appointmentTime: appointmentData?.time || patientData.appointment_time || null,
        date: appointmentData?.date || null,
        specialty: getSpecialtyNameById(patientData.specialty || ""),
        professional: getProfessionalNameById(patientData.professional || ""),
        health_plan: getHealthPlanNameById(patientData.health_plan || "")
      };
      
      // Salvar no cache
      apiCache.set(cacheKey, fullPatientData, 5 * 60 * 1000);
      return fullPatientData;
    } catch (error) {
      console.error("Erro ao buscar paciente por ID:", error);
      return null;
    }
  },
  
  // Limpar o cache
  clearCache(patientId?: string) {
    if (patientId) {
      apiCache.clear(`patient_${patientId}`);
    }
    apiCache.clear('patients_all');
  }
};

// Exportar outras APIs conforme necessário
export { apiCache }; 