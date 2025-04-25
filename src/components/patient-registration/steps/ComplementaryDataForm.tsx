
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ComplementaryDataFormProps {
  data: any;
  onUpdate: (data: any) => void;
}

const ComplementaryDataForm: React.FC<ComplementaryDataFormProps> = ({ data, onUpdate }) => {
  const additionalData = data.additionalData || {};
  
  const handleChange = (field: string, value: string) => {
    onUpdate({
      additionalData: {
        ...additionalData,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidade</label>
        <Select
          value={additionalData.nationality || ""}
          onValueChange={(value) => handleChange("nationality", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a nacionalidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="brasileira">Brasileira</SelectItem>
            <SelectItem value="estrangeira">Estrangeira</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Naturalidade</label>
        <Input
          value={additionalData.place_of_birth || ""}
          onChange={(e) => handleChange("place_of_birth", e.target.value)}
          placeholder="Cidade de nascimento"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Nascimento</label>
        <Input
          value={additionalData.place_of_birth_state || ""}
          onChange={(e) => handleChange("place_of_birth_state", e.target.value)}
          placeholder="Estado de nascimento"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ocupação</label>
        <Input
          value={additionalData.occupation || ""}
          onChange={(e) => handleChange("occupation", e.target.value)}
          placeholder="Digite a ocupação"
        />
      </div>
    </div>
  );
};

export default ComplementaryDataForm;
