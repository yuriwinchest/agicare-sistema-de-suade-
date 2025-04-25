
import React from "react";
import { Input } from "@/components/ui/input";

interface DocumentsFormProps {
  data: any;
  onUpdate: (data: any) => void;
}

const DocumentsForm: React.FC<DocumentsFormProps> = ({ data, onUpdate }) => {
  const handleChange = (field: string, value: string) => {
    onUpdate({
      documents: [{
        document_type: "RG",
        document_number: value
      }]
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
        <Input
          value={data.documents?.[0]?.document_number || ""}
          onChange={(e) => handleChange("document_number", e.target.value)}
          placeholder="Digite o RG"
        />
      </div>
    </div>
  );
};

export default DocumentsForm;
