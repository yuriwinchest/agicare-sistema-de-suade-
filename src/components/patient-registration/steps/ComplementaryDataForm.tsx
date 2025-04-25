
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ComplementaryDataFormProps {
  data: any;
  onUpdate: (data: any) => void;
}

const brazilianStates = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", 
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", 
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

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
        <div className="grid grid-cols-4 gap-4 mt-2">
          {brazilianStates.map((state) => (
            <div key={state} className="flex items-center space-x-2">
              <Checkbox
                id={`state-${state}`}
                checked={additionalData.place_of_birth_state === state}
                onCheckedChange={() => handleChange("place_of_birth_state", state)}
              />
              <label
                htmlFor={`state-${state}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {state}
              </label>
            </div>
          ))}
        </div>
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
