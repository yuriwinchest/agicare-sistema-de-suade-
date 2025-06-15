import { supabase } from "@/integrations/supabase/client";

export type PaymentMethod = 'HEALTH_INSURANCE' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'PIX' | 'BANK_TRANSFER';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'CANCELLED';
export type ServiceType = 'CONSULTATION' | 'EXAM' | 'PROCEDURE' | 'SURGERY' | 'NURSING' | 'OTHER';

// Categorias comuns de exames para uso no sistema
export const examCategories = [
  { id: "exm-img", name: "Exames de Imagem", description: "Raio-X, Tomografia, Ressonância, Ultrassonografia" },
  { id: "exm-lab", name: "Exames Laboratoriais", description: "Análises clínicas, exames de sangue, urina e outros" },
  { id: "exm-car", name: "Exames Cardiológicos", description: "ECG, Holter, MAPA, Teste Ergométrico" },
  { id: "exm-neu", name: "Exames Neurológicos", description: "EEG, EMG, Potencial Evocado" },
  { id: "exm-end", name: "Exames Endoscópicos", description: "Colonoscopia, Endoscopia Digestiva, Broncoscopia" },
  { id: "exm-oft", name: "Exames Oftalmológicos", description: "Mapeamento de Retina, Tonometria, Campimetria" },
  { id: "exm-aud", name: "Exames Audiológicos", description: "Audiometria, Impedanciometria" },
  { id: "exm-out", name: "Outros Exames", description: "Demais exames não classificados nas outras categorias" },
];

// Categorias comuns de procedimentos para uso no sistema
export const procedureCategories = [
  { id: "prc-crg", name: "Cirurgias Ambulatoriais", description: "Pequenas cirurgias realizadas em ambiente ambulatorial" },
  { id: "prc-cur", name: "Curativos", description: "Diferentes tipos de curativos médicos" },
  { id: "prc-apl", name: "Aplicações", description: "Aplicação de medicamentos, vacinas e outros injetáveis" },
  { id: "prc-fis", name: "Fisioterapia", description: "Procedimentos fisioterápicos diversos" },
  { id: "prc-ina", name: "Inalações", description: "Procedimentos de inaloterapia" },
  { id: "prc-est", name: "Procedimentos Estéticos", description: "Procedimentos estéticos diversos" },
  { id: "prc-out", name: "Outros Procedimentos", description: "Procedimentos não classificados nas outras categorias" },
];

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  services?: PaymentService[];
}

export interface PaymentService {
  id: string;
  paymentId: string;
  serviceId: string;
  serviceName?: string; // Para exibição
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  createdAt: string;
}

export interface ServicePrice {
  id: string;
  name: string;
  description?: string;
  price: number;
  type: ServiceType;
  active: boolean;
  categoryId?: string;
  categoryName?: string; // Para exibição
  location?: string; // Indicação de região/local para o exame/procedimento
  duration?: number; // Duração estimada do procedimento em minutos
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
}

export interface CreatePaymentDto {
  appointmentId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  services?: {
    serviceId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }[];
}

export interface UpdatePaymentDto {
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  amount?: number;
  paidAt?: string;
  notes?: string;
  services?: {
    serviceId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }[];
}

export interface CreateServicePriceDto {
  name: string;
  description?: string;
  price: number;
  type: ServiceType;
  active?: boolean;
  categoryId?: string;
  location?: string;
  duration?: number;
}

export interface UpdateServicePriceDto {
  name?: string;
  description?: string;
  price?: number;
  type?: ServiceType;
  active?: boolean;
  categoryId?: string;
  location?: string;
  duration?: number;
}

/**
 * Serviço para gerenciar pagamentos no sistema SaludoCare
 */
class PaymentService {
  /**
   * Busca todos os pagamentos
   */
  async getAllPayments(): Promise<Payment[]> {
    try {
      const { data, error } = await supabase
        .from('Payment')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      throw error;
    }
  }

  /**
   * Busca um pagamento pelo ID
   */
  async getPaymentById(id: string): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from('Payment')
        .select(`
          *,
          services:PaymentService(
            *,
            service:ServicePrice(id, name, price, type)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar pagamento ${id}:`, error);
      throw error;
    }
  }

  /**
   * Busca pagamentos por ID de agendamento
   */
  async getPaymentsByAppointment(appointmentId: string): Promise<Payment[]> {
    try {
      const { data, error } = await supabase
        .from('Payment')
        .select(`
          *,
          services:PaymentService(
            *,
            service:ServicePrice(id, name, price, type)
          )
        `)
        .eq('appointmentId', appointmentId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Erro ao buscar pagamentos para agendamento ${appointmentId}:`, error);
      throw error;
    }
  }

  /**
   * Cria um novo pagamento
   */
  async createPayment(paymentData: CreatePaymentDto): Promise<Payment> {
    try {
      // Inserir o pagamento principal
      const { data: payment, error } = await supabase
        .from('Payment')
        .insert({
          appointmentId: paymentData.appointmentId,
          amount: paymentData.amount,
          paymentMethod: paymentData.paymentMethod,
          notes: paymentData.notes,
          paymentStatus: 'PENDING',
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Se houver serviços, inserir os relacionamentos
      if (paymentData.services && paymentData.services.length > 0 && payment) {
        const paymentServices = paymentData.services.map(service => ({
          paymentId: payment.id,
          serviceId: service.serviceId,
          quantity: service.quantity,
          unitPrice: service.unitPrice,
          discount: service.discount || 0,
          total: service.quantity * service.unitPrice * (1 - (service.discount || 0) / 100)
        }));
        
        const { error: servicesError } = await supabase
          .from('PaymentService')
          .insert(paymentServices);
        
        if (servicesError) throw servicesError;
      }
      
      return payment;
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      throw error;
    }
  }

  /**
   * Atualiza um pagamento existente
   */
  async updatePayment(id: string, paymentData: UpdatePaymentDto): Promise<Payment> {
    try {
      // Atualizar o pagamento principal
      const { data: payment, error } = await supabase
        .from('Payment')
        .update({
          paymentStatus: paymentData.paymentStatus,
          paymentMethod: paymentData.paymentMethod,
          amount: paymentData.amount,
          paidAt: paymentData.paymentStatus === 'PAID' && !paymentData.paidAt ? new Date().toISOString() : paymentData.paidAt,
          notes: paymentData.notes,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Se houver serviços, atualizar os relacionamentos
      if (paymentData.services && payment) {
        // Primeiro removemos todos os serviços existentes
        const { error: deleteError } = await supabase
          .from('PaymentService')
          .delete()
          .eq('paymentId', id);
        
        if (deleteError) throw deleteError;
        
        // Depois inserimos os novos
        const paymentServices = paymentData.services.map(service => ({
          paymentId: payment.id,
          serviceId: service.serviceId,
          quantity: service.quantity,
          unitPrice: service.unitPrice,
          discount: service.discount || 0,
          total: service.quantity * service.unitPrice * (1 - (service.discount || 0) / 100)
        }));
        
        const { error: servicesError } = await supabase
          .from('PaymentService')
          .insert(paymentServices);
        
        if (servicesError) throw servicesError;
      }
      
      return payment;
    } catch (error) {
      console.error(`Erro ao atualizar pagamento ${id}:`, error);
      throw error;
    }
  }

  /**
   * Busca todos os serviços disponíveis
   */
  async getAllServices(onlyActive: boolean = true): Promise<ServicePrice[]> {
    try {
      let query = supabase
        .from('ServicePrice')
        .select(`
          *,
          category:ServiceCategory(id, name)
        `);
      
      if (onlyActive) {
        query = query.eq('active', true);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      
      // Formatar os dados para incluir o nome da categoria
      return (data || []).map(service => ({
        ...service,
        categoryName: service.category?.name
      }));
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      throw error;
    }
  }

  /**
   * Busca serviços por tipo
   */
  async getServicesByType(type: ServiceType, onlyActive: boolean = true): Promise<ServicePrice[]> {
    try {
      let query = supabase
        .from('ServicePrice')
        .select(`
          *,
          category:ServiceCategory(id, name)
        `)
        .eq('type', type);
      
      if (onlyActive) {
        query = query.eq('active', true);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      
      // Formatar os dados para incluir o nome da categoria
      return (data || []).map(service => ({
        ...service,
        categoryName: service.category?.name
      }));
    } catch (error) {
      console.error(`Erro ao buscar serviços do tipo ${type}:`, error);
      throw error;
    }
  }

  /**
   * Busca serviços por categoria
   */
  async getServicesByCategory(categoryId: string, onlyActive: boolean = true): Promise<ServicePrice[]> {
    try {
      let query = supabase
        .from('ServicePrice')
        .select(`
          *,
          category:ServiceCategory(id, name)
        `)
        .eq('categoryId', categoryId);
      
      if (onlyActive) {
        query = query.eq('active', true);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      
      // Formatar os dados para incluir o nome da categoria
      return (data || []).map(service => ({
        ...service,
        categoryName: service.category?.name
      }));
    } catch (error) {
      console.error(`Erro ao buscar serviços da categoria ${categoryId}:`, error);
      throw error;
    }
  }

  /**
   * Cria um novo serviço
   */
  async createService(serviceData: CreateServicePriceDto): Promise<ServicePrice> {
    try {
      const { data, error } = await supabase
        .from('ServicePrice')
        .insert({
          name: serviceData.name,
          description: serviceData.description,
          price: serviceData.price,
          type: serviceData.type,
          active: serviceData.active !== undefined ? serviceData.active : true,
          categoryId: serviceData.categoryId,
          location: serviceData.location,
          duration: serviceData.duration
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      throw error;
    }
  }

  /**
   * Atualiza um serviço existente
   */
  async updateService(id: string, serviceData: UpdateServicePriceDto): Promise<ServicePrice> {
    try {
      const { data, error } = await supabase
        .from('ServicePrice')
        .update({
          name: serviceData.name,
          description: serviceData.description,
          price: serviceData.price,
          type: serviceData.type,
          active: serviceData.active,
          categoryId: serviceData.categoryId,
          location: serviceData.location,
          duration: serviceData.duration
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao atualizar serviço ${id}:`, error);
      throw error;
    }
  }

  /**
   * Busca todas as categorias de serviços
   */
  async getAllCategories(): Promise<ServiceCategory[]> {
    try {
      // Primeiro, busca categorias salvas no banco de dados
      const { data, error } = await supabase
        .from('ServiceCategory')
        .select('*');
      
      if (error) throw error;
      
      // Combina com categorias pré-definidas
      const savedCategories = data || [];
      const examCats = examCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description
      }));
      const procedureCats = procedureCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description
      }));
      
      // Retorna combinando todas as categorias, removendo duplicatas
      const allCategories = [...savedCategories, ...examCats, ...procedureCats];
      const uniqueCategories = allCategories.filter((cat, index, self) => 
        index === self.findIndex(c => c.id === cat.id)
      );
      
      return uniqueCategories;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova categoria de serviço
   */
  async createCategory(name: string, description?: string): Promise<ServiceCategory> {
    try {
      const { data, error } = await supabase
        .from('ServiceCategory')
        .insert({
          name,
          description
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar categoria de serviço:', error);
      throw error;
    }
  }

  /**
   * Verifica se uma categoria existe no catálogo de categorias pré-definidas
   */
  isPredefinedCategory(categoryId: string): boolean {
    // Verificar nas categorias de exames
    if (examCategories.some(cat => cat.id === categoryId)) {
      return true;
    }
    
    // Verificar nas categorias de procedimentos
    if (procedureCategories.some(cat => cat.id === categoryId)) {
      return true;
    }
    
    return false;
  }

  /**
   * Obtém categorias pré-definidas por tipo
   */
  getPredefinedCategories(type: ServiceType): ServiceCategory[] {
    switch (type) {
      case 'EXAM':
        return examCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description
        }));
      case 'PROCEDURE':
        return procedureCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description
        }));
      default:
        return [];
    }
  }
}

export const paymentService = new PaymentService(); 