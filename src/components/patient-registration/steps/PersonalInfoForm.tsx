
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ensureProperDateFormat } from "@/services/patients/utils/dateUtils";

interface PersonalInfoFormProps {
  data: any;
  onUpdate: (data: any) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onUpdate }) => {
  const handleChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format the date correctly as user types
    const inputValue = e.target.value;
    const formattedDate = ensureProperDateFormat(inputValue);
    
    // Update with the formatted value
    handleChange("birth_date", formattedDate);
    
    // Return the formatted date to update the input value
    return formattedDate;
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
        <Input
          value={data.birth_date || ""}
          onChange={handleDateChange}
          placeholder="DD/MM/AAAA"
          maxLength={10}
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
