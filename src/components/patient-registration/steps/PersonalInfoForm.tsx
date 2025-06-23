import React from "react";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StandardLabel } from "@/components/ui/FormLabel";
import { GENDER_OPTIONS } from "@/constants/formOptions";

/**
 * PersonalInfoForm
 * Responsabilidade: Formulário de informações pessoais do paciente
 * Princípios: DRY - Usa componentes e constantes reutilizáveis
 */

interface PersonalInfoFormProps {
  data: any;
  onUpdate: (data: any) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onUpdate }) => {
  const handleChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <StandardLabel required>Nome Completo</StandardLabel>
        <Input
          value={data.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Digite o nome completo"
        />
      </div>

      <div>
        <StandardLabel>Data de Nascimento</StandardLabel>
        <DateInput
          value={data.birth_date || ""}
          onChange={(value) => handleChange("birth_date", value)}
          placeholder="DD/MM/AAAA"
        />
      </div>

      <div>
        <StandardLabel>Sexo</StandardLabel>
        <Select value={data.gender} onValueChange={(value) => handleChange("gender", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o sexo" />
          </SelectTrigger>
          <SelectContent>
            {GENDER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <StandardLabel>CPF</StandardLabel>
        <Input
          value={data.cpf || ""}
          onChange={(e) => handleChange("cpf", e.target.value)}
          placeholder="Digite o CPF"
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
