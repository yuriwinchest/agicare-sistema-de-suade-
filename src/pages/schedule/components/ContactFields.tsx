
import React from "react";
import { Input } from "@/components/ui/input";

interface ContactFieldsProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const ContactFields: React.FC<ContactFieldsProps> = ({ data, onChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
        <Input
          placeholder="00000-000"
          className="border-teal-500/30 focus-visible:ring-teal-500/30"
          value={data.addressDetails.zipCode}
          onChange={(e) => onChange("addressDetails.zipCode", e.target.value)}
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
        <Input
          placeholder="Digite o endereço"
          className="border-teal-500/30 focus-visible:ring-teal-500/30"
          value={data.addressDetails.street}
          onChange={(e) => onChange("addressDetails.street", e.target.value)}
        />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Principal</label>
        <Input
          placeholder="(00) 00000-0000"
          className="border-teal-500/30 focus-visible:ring-teal-500/30"
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Alternativo</label>
        <Input placeholder="(00) 00000-0000" className="border-teal-500/30 focus-visible:ring-teal-500/30" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Input placeholder="email@exemplo.com" className="border-teal-500/30 focus-visible:ring-teal-500/30" />
      </div>
    </div>
  </div>
);

export default ContactFields;
