
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PersonalInfoFieldsProps {
  data: any;
  birthDate: string;
  onChange: (field: string, value: any) => void;
  onBirthDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ data, birthDate, onChange, onBirthDateChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Prontuário</label>
        <Input value={data.id} readOnly className="border-teal-500/30 focus-visible:ring-teal-500/30" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pessoa</label>
        <Select defaultValue="fisica">
          <SelectTrigger className="border-teal-500/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fisica">FÍSICA</SelectItem>
            <SelectItem value="juridica">JURÍDICA</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
        <Input
          placeholder="Digite o nome completo"
          className="border-teal-500/30 focus-visible:ring-teal-500/30"
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CNS</label>
        <Input placeholder="000-0000-0000-0000" className="border-teal-500/30 focus-visible:ring-teal-500/30" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
        <Input
          placeholder="DD/MM/AAAA"
          className="border-teal-500/30 focus-visible:ring-teal-500/30"
          value={birthDate}
          onChange={(e) => {
            onBirthDateChange(e);
            onChange("birthDate", e.target.value);
            onChange("birth_date", e.target.value);
          }}
          maxLength={10}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
        <Select>
          <SelectTrigger className="border-teal-500/30">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solteiro">SOLTEIRO(A)</SelectItem>
            <SelectItem value="casado">CASADO(A)</SelectItem>
            <SelectItem value="divorciado">DIVORCIADO(A)</SelectItem>
            <SelectItem value="viuvo">VIÚVO(A)</SelectItem>
            <SelectItem value="uniao">UNIÃO ESTÁVEL</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sexo Biológico</label>
        <Select value={data.gender} onValueChange={value => onChange("gender", value)}>
          <SelectTrigger className="border-teal-500/30">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Masculino">MASCULINO</SelectItem>
            <SelectItem value="Feminino">FEMININO</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div className="flex items-center space-x-2 mt-4">
      <Switch
        id="paciente-ativo"
        checked={data.active}
        onCheckedChange={checked => onChange("active", checked)}
      />
      <Label htmlFor="paciente-ativo">Paciente Ativo?</Label>
    </div>
  </div>
);

export default PersonalInfoFields;
