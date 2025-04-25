
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DocumentsFormProps {
  data: any;
  onUpdate: (data: any) => void;
}

const DocumentsForm: React.FC<DocumentsFormProps> = ({ data, onUpdate }) => {
  const document = data.documents?.[0] || { document_type: "RG", document_number: "" };

  const handleChange = (field: string, value: string) => {
    const updatedDocument = { ...document, [field]: value };
    
    onUpdate({
      documents: [updatedDocument]
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
        <Select
          value={document.document_type}
          onValueChange={(value) => handleChange("document_type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de documento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="RG">RG</SelectItem>
            <SelectItem value="CPF">CPF</SelectItem>
            <SelectItem value="CNH">CNH</SelectItem>
            <SelectItem value="PASSAPORTE">Passaporte</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Número do Documento</label>
        <Input
          value={document.document_number || ""}
          onChange={(e) => handleChange("document_number", e.target.value)}
          placeholder={`Digite o ${document.document_type}`}
        />
      </div>

      {document.document_type !== "CPF" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Órgão Emissor</label>
          <Input
            value={document.issuing_body || ""}
            onChange={(e) => handleChange("issuing_body", e.target.value)}
            placeholder="Digite o órgão emissor"
          />
        </div>
      )}
    </div>
  );
};

export default DocumentsForm;
