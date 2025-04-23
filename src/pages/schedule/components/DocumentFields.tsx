
import React from "react";
import { Input } from "@/components/ui/input";

interface DocumentFieldsProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const DocumentFields: React.FC<DocumentFieldsProps> = ({ data, onChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
        <Input
          placeholder="000.000.000-00"
          className="border-teal-500/30 focus-visible:ring-teal-500/30"
          value={data.cpf}
          onChange={(e) => onChange("cpf", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
        <Input placeholder="0000000000" className="border-teal-500/30 focus-visible:ring-teal-500/30" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Órgão Emissor</label>
        <Input placeholder="SSP/UF" className="border-teal-500/30 focus-visible:ring-teal-500/30" />
      </div>
    </div>
  </div>
);

export default DocumentFields;
