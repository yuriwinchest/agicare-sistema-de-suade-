
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";

interface AllergiesFormProps {
  data: any;
  onUpdate: (data: any) => void;
}

const AllergiesForm: React.FC<AllergiesFormProps> = ({ data, onUpdate }) => {
  const [allergyInput, setAllergyInput] = useState({ type: "", description: "" });

  const handleAddAllergy = () => {
    if (!allergyInput.type || !allergyInput.description) return;

    const newAllergies = [
      ...(data.allergies || []),
      {
        allergy_type: allergyInput.type,
        description: allergyInput.description,
        severity: "Moderada"
      }
    ];

    onUpdate({ allergies: newAllergies });
    setAllergyInput({ type: "", description: "" });
  };

  const handleRemoveAllergy = (index: number) => {
    const newAllergies = [...(data.allergies || [])];
    newAllergies.splice(index, 1);
    onUpdate({ allergies: newAllergies });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div>
          <Select
            value={allergyInput.type}
            onValueChange={(value) => setAllergyInput(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Alergia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Medicamento">Medicamento</SelectItem>
              <SelectItem value="Alimento">Alimento</SelectItem>
              <SelectItem value="Outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <div className="flex gap-2">
            <Input
              placeholder="Descreva a alergia"
              value={allergyInput.description}
              onChange={(e) => setAllergyInput(prev => ({ ...prev, description: e.target.value }))}
            />
            <Button onClick={handleAddAllergy} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {(data.allergies || []).map((allergy: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border rounded-md"
          >
            <div>
              <span className="font-medium">{allergy.allergy_type}:</span>
              <span className="ml-2">{allergy.description}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveAllergy(index)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllergiesForm;
