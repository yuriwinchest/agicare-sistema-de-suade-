
import React from "react";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
        <Input
          value={data.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Digite o nome completo"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
        <DateInput
          value={data.birth_date || ""}
          onChange={(value) => handleChange("birth_date", value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
        <Select value={data.gender} onValueChange={(value) => handleChange("gender", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o sexo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Masculino">Masculino</SelectItem>
            <SelectItem value="Feminino">Feminino</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
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
