import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X, User, Phone, Mail, Calendar, MapPin, Heart } from 'lucide-react';

interface PatientFormData {
  name: string;
  cpf: string;
  rg: string;
  birthdate: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  healthPlan: string;
  healthPlanNumber: string;
  emergencyContact: string;
  emergencyPhone: string;
  allergies: string;
  medications: string;
  observations: string;
}

export default function PatientRegistrationForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    cpf: '',
    rg: '',
    birthdate: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    healthPlan: '',
    healthPlanNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
    allergies: '',
    medications: '',
    observations: ''
  });

  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validações básicas
      if (!formData.name || !formData.cpf || !formData.phone) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha nome, CPF e telefone.",
          variant: "destructive",
        });
        return;
      }

      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Paciente cadastrado",
        description: "Paciente cadastrado com sucesso!",
      });

      navigate('/reception');
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Não foi possível cadastrar o paciente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/reception');
  };

  return (
    <div className="reception-module">
      <div className="reception-container">
        <div className="reception-header">
          <h1 className="reception-title">Cadastro de Paciente</h1>
          <div className="reception-actions">
            <button
              type="button"
              className="reception-btn-secondary"
              onClick={handleCancel}
            >
              <X size={18} />
              Cancelar
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Pessoais */}
          <Card className="patient-form-container">
            <CardHeader>
              <CardTitle className="patient-form-section-title">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="patient-form-section">
              <div className="patient-form-grid">
                <div className="reception-form-field">
                  <label className="reception-form-label">Nome Completo *</label>
                  <Input
                    className="reception-form-input"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>

                <div className="reception-form-field">
                  <label className="reception-form-label">CPF *</label>
                  <Input
                    className="reception-form-input"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div className="reception-form-field">
                  <label className="reception-form-label">RG</label>
                  <Input
                    className="reception-form-input"
                    value={formData.rg}
                    onChange={(e) => handleInputChange('rg', e.target.value)}
                    placeholder="00.000.000-0"
                  />
                </div>

                <div className="reception-form-field">
                  <label className="reception-form-label">Data de Nascimento</label>
                  <Input
                    type="date"
                    className="reception-form-input"
                    value={formData.birthdate}
                    onChange={(e) => handleInputChange('birthdate', e.target.value)}
                  />
                </div>

                <div className="reception-form-field">
                  <label className="reception-form-label">Sexo</label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="reception-select-trigger">
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                      <SelectItem value="O">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="patient-form-container">
            <CardHeader>
              <CardTitle className="patient-form-section-title">
                <Phone className="h-5 w-5" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="patient-form-section">
              <div className="patient-form-grid">
                <div className="reception-form-field">
                  <label className="reception-form-label">Telefone *</label>
                  <Input
                    className="reception-form-input"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>

                <div className="reception-form-field">
                  <label className="reception-form-label">E-mail</label>
                  <Input
                    type="email"
                    className="reception-form-input"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="exemplo@email.com"
                  />
                </div>

                <div className="reception-form-field">
                  <label className="reception-form-label">Contato de Emergência</label>
                  <Input
                    className="reception-form-input"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    placeholder="Nome do contato"
                  />
                </div>

                <div className="reception-form-field">
                  <label className="reception-form-label">Telefone de Emergência</label>
                  <Input
                    className="reception-form-input"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card className="patient-form-container">
            <CardHeader>
              <CardTitle className="patient-form-section-title">
                <MapPin className="h-5 w-5" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="patient-form-section">
              <div className="patient-form-grid">
                <div className="reception-form-field md:col-span-2">
                  <label className="reception-form-label">Endereço</label>
                  <Input
                    className="reception-form-input"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Rua, número, complemento"
                  />
                </div>

                <div className="reception-form-field">
                  <label className="reception-form-label">Cidade</label>
                  <Input
                    className="reception-form-input"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Nome da cidade"
                  />
                </div>

                <div className="reception-form-field">
                  <label className="reception-form-label">Estado</label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                    <SelectTrigger className="reception-select-trigger">
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                      <SelectItem value="PR">Paraná</SelectItem>
                      <SelectItem value="SC">Santa Catarina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="reception-form-field">
                  <label className="reception-form-label">CEP</label>
                  <Input
                    className="reception-form-input"
                    value={formData.zipcode}
                    onChange={(e) => handleInputChange('zipcode', e.target.value)}
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Médicas */}
          <Card className="patient-form-container">
            <CardHeader>
              <CardTitle className="patient-form-section-title">
                <Heart className="h-5 w-5" />
                Informações Médicas
              </CardTitle>
            </CardHeader>
            <CardContent className="patient-form-section">
              <div className="patient-form-grid">
                <div className="reception-form-field">
                  <label className="reception-form-label">Plano de Saúde</label>
                  <Input
                    className="reception-form-input"
                    value={formData.healthPlan}
                    onChange={(e) => handleInputChange('healthPlan', e.target.value)}
                    placeholder="Nome do convênio"
                  />
                </div>

                <div className="reception-form-field">
                  <label className="reception-form-label">Número da Carteirinha</label>
                  <Input
                    className="reception-form-input"
                    value={formData.healthPlanNumber}
                    onChange={(e) => handleInputChange('healthPlanNumber', e.target.value)}
                    placeholder="Número do cartão"
                  />
                </div>

                <div className="reception-form-field patient-form-grid-full">
                  <label className="reception-form-label">Alergias</label>
                  <Textarea
                    className="reception-form-input min-h-[80px]"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    placeholder="Descreva alergias conhecidas"
                  />
                </div>

                <div className="reception-form-field patient-form-grid-full">
                  <label className="reception-form-label">Medicações em Uso</label>
                  <Textarea
                    className="reception-form-input min-h-[80px]"
                    value={formData.medications}
                    onChange={(e) => handleInputChange('medications', e.target.value)}
                    placeholder="Liste medicações em uso"
                  />
                </div>

                <div className="reception-form-field patient-form-grid-full">
                  <label className="reception-form-label">Observações</label>
                  <Textarea
                    className="reception-form-input min-h-[100px]"
                    value={formData.observations}
                    onChange={(e) => handleInputChange('observations', e.target.value)}
                    placeholder="Informações adicionais relevantes"
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
              {isSubmitting ? 'Salvando...' : 'Salvar Paciente'}
            </button>
            
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X size={18} />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}