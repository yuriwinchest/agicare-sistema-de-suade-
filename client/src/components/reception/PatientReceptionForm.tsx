import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Save, Calendar, User, CreditCard, FileText } from 'lucide-react';

interface PatientReceptionFormProps {
  formData: any;
  handleChange: (field: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  goBack: () => void;
  isSubmitting: boolean;
}

export default function PatientReceptionForm({
  formData,
  handleChange,
  handleSubmit,
  goBack,
  isSubmitting
}: PatientReceptionFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações do Atendimento */}
      <Card className="patient-form-container">
        <CardHeader>
          <CardTitle className="patient-form-section-title">
            <Calendar className="h-5 w-5" />
            Informações do Atendimento
          </CardTitle>
        </CardHeader>
        <CardContent className="patient-form-section">
          <div className="patient-form-grid">
            <div className="reception-form-field">
              <label className="reception-form-label">Tipo de Atendimento *</label>
              <Select 
                value={formData.attendance_type} 
                onValueChange={(value) => handleChange('attendance_type', value)}
              >
                <SelectTrigger className="reception-select-trigger">
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent className="reception-select-content">
                  <SelectItem value="consulta" className="reception-select-item">Consulta</SelectItem>
                  <SelectItem value="retorno" className="reception-select-item">Retorno</SelectItem>
                  <SelectItem value="exame" className="reception-select-item">Exame</SelectItem>
                  <SelectItem value="procedimento" className="reception-select-item">Procedimento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="reception-form-field">
              <label className="reception-form-label">Especialidade *</label>
              <Select 
                value={formData.specialty} 
                onValueChange={(value) => handleChange('specialty', value)}
              >
                <SelectTrigger className="reception-select-trigger">
                  <SelectValue placeholder="Selecionar especialidade" />
                </SelectTrigger>
                <SelectContent className="reception-select-content">
                  <SelectItem value="cardiologia" className="reception-select-item">Cardiologia</SelectItem>
                  <SelectItem value="clinica-geral" className="reception-select-item">Clínica Geral</SelectItem>
                  <SelectItem value="dermatologia" className="reception-select-item">Dermatologia</SelectItem>
                  <SelectItem value="ginecologia" className="reception-select-item">Ginecologia</SelectItem>
                  <SelectItem value="pediatria" className="reception-select-item">Pediatria</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="reception-form-field">
              <label className="reception-form-label">Profissional *</label>
              <Select 
                value={formData.professional} 
                onValueChange={(value) => handleChange('professional', value)}
              >
                <SelectTrigger className="reception-select-trigger">
                  <SelectValue placeholder="Selecionar profissional" />
                </SelectTrigger>
                <SelectContent className="reception-select-content">
                  <SelectItem value="dr-silva" className="reception-select-item">Dr. João Silva</SelectItem>
                  <SelectItem value="dra-santos" className="reception-select-item">Dra. Maria Santos</SelectItem>
                  <SelectItem value="dr-oliveira" className="reception-select-item">Dr. Pedro Oliveira</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="reception-form-field">
              <label className="reception-form-label">Horário do Atendimento</label>
              <Input
                type="time"
                className="reception-form-input"
                value={formData.appointment_time}
                onChange={(e) => handleChange('appointment_time', e.target.value)}
              />
            </div>

            <div className="reception-form-field md:col-span-2">
              <label className="reception-form-label">Procedimento</label>
              <Input
                className="reception-form-input"
                value={formData.procedure}
                onChange={(e) => handleChange('procedure', e.target.value)}
                placeholder="Descreva o procedimento"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Convênio */}
      <Card className="patient-form-container">
        <CardHeader>
          <CardTitle className="patient-form-section-title">
            <CreditCard className="h-5 w-5" />
            Informações do Convênio
          </CardTitle>
        </CardHeader>
        <CardContent className="patient-form-section">
          <div className="patient-form-grid">
            <div className="reception-form-field">
              <label className="reception-form-label">Plano de Saúde</label>
              <Input
                className="reception-form-input"
                value={formData.healthPlan}
                onChange={(e) => handleChange('healthPlan', e.target.value)}
                placeholder="Nome do convênio"
              />
            </div>

            <div className="reception-form-field">
              <label className="reception-form-label">Número da Carteirinha</label>
              <Input
                className="reception-form-input"
                value={formData.health_card_number}
                onChange={(e) => handleChange('health_card_number', e.target.value)}
                placeholder="Número do cartão"
              />
            </div>

            <div className="reception-form-field">
              <label className="reception-form-label">Método de Pagamento</label>
              <Select 
                value={formData.payment_method} 
                onValueChange={(value) => handleChange('payment_method', value)}
              >
                <SelectTrigger className="reception-select-trigger">
                  <SelectValue placeholder="Selecionar método" />
                </SelectTrigger>
                <SelectContent className="reception-select-content">
                  <SelectItem value="HEALTH_INSURANCE" className="reception-select-item">Convênio</SelectItem>
                  <SelectItem value="CASH" className="reception-select-item">Dinheiro</SelectItem>
                  <SelectItem value="CARD" className="reception-select-item">Cartão</SelectItem>
                  <SelectItem value="PIX" className="reception-select-item">PIX</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="reception-form-field">
              <label className="reception-form-label">Valor do Atendimento</label>
              <Input
                type="number"
                className="reception-form-input"
                value={formData.payment_amount}
                onChange={(e) => handleChange('payment_amount', e.target.value)}
                placeholder="0,00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsável (se necessário) */}
      <Card className="patient-form-container">
        <CardHeader>
          <CardTitle className="patient-form-section-title">
            <User className="h-5 w-5" />
            Responsável pelo Paciente
          </CardTitle>
        </CardHeader>
        <CardContent className="patient-form-section">
          <div className="patient-form-grid">
            <div className="reception-form-field">
              <label className="reception-form-label">Nome do Responsável</label>
              <Input
                className="reception-form-input"
                value={formData.responsible_name}
                onChange={(e) => handleChange('responsible_name', e.target.value)}
                placeholder="Nome completo"
              />
            </div>

            <div className="reception-form-field">
              <label className="reception-form-label">Documento do Responsável</label>
              <Input
                className="reception-form-input"
                value={formData.responsible_document}
                onChange={(e) => handleChange('responsible_document', e.target.value)}
                placeholder="CPF ou RG"
              />
            </div>

            <div className="reception-form-field">
              <label className="reception-form-label">Parentesco</label>
              <Select 
                value={formData.responsible_relationship} 
                onValueChange={(value) => handleChange('responsible_relationship', value)}
              >
                <SelectTrigger className="reception-select-trigger">
                  <SelectValue placeholder="Selecionar parentesco" />
                </SelectTrigger>
                <SelectContent className="reception-select-content">
                  <SelectItem value="pai" className="reception-select-item">Pai</SelectItem>
                  <SelectItem value="mae" className="reception-select-item">Mãe</SelectItem>
                  <SelectItem value="conjuge" className="reception-select-item">Cônjuge</SelectItem>
                  <SelectItem value="filho" className="reception-select-item">Filho(a)</SelectItem>
                  <SelectItem value="outro" className="reception-select-item">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="reception-form-field">
              <label className="reception-form-label">Origem do Paciente</label>
              <Select 
                value={formData.origin_location} 
                onValueChange={(value) => handleChange('origin_location', value)}
              >
                <SelectTrigger className="reception-select-trigger">
                  <SelectValue placeholder="Selecionar origem" />
                </SelectTrigger>
                <SelectContent className="reception-select-content">
                  <SelectItem value="1" className="reception-select-item">Próprio Paciente</SelectItem>
                  <SelectItem value="2" className="reception-select-item">Encaminhamento</SelectItem>
                  <SelectItem value="3" className="reception-select-item">Emergência</SelectItem>
                  <SelectItem value="4" className="reception-select-item">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observações */}
      <Card className="patient-form-container">
        <CardHeader>
          <CardTitle className="patient-form-section-title">
            <FileText className="h-5 w-5" />
            Observações Adicionais
          </CardTitle>
        </CardHeader>
        <CardContent className="patient-form-section">
          <div className="patient-form-grid-full">
            <div className="reception-form-field">
              <label className="reception-form-label">Observações</label>
              <Textarea
                className="reception-form-input min-h-[100px]"
                value={formData.observations}
                onChange={(e) => handleChange('observations', e.target.value)}
                placeholder="Informações relevantes sobre o atendimento"
              />
            </div>

            <div className="reception-form-field">
              <label className="reception-form-label">Notas de Pagamento</label>
              <Textarea
                className="reception-form-input min-h-[80px]"
                value={formData.payment_notes}
                onChange={(e) => handleChange('payment_notes', e.target.value)}
                placeholder="Observações sobre o pagamento"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="reception-action-buttons">
        <button
          type="submit"
          className="btn-save"
          disabled={isSubmitting}
        >
          <Save size={18} />
          {isSubmitting ? 'Registrando...' : 'Registrar Atendimento'}
        </button>
        
        <button
          type="button"
          className="btn-cancel"
          onClick={goBack}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}