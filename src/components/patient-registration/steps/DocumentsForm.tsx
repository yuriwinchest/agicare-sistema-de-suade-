
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface DocumentsFormProps {
  data: any;
  onUpdate: (data: any) => void;
}

const DocumentsForm: React.FC<DocumentsFormProps> = ({ data, onUpdate }) => {
  // Initialize documents array from patient data
  const documents = data.documents || [];

  // Create a new document
  const handleAddDocument = () => {
    const newDocument = {
      document_type: "RG",
      document_number: "",
      issuing_body: ""
    };
    
    onUpdate({
      documents: [...documents, newDocument]
    });
  };

  // Update a document
  const handleDocumentChange = (index: number, field: string, value: string) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      [field]: value
    };
    
    onUpdate({
      documents: updatedDocuments
    });
  };

  // Remove a document
  const handleRemoveDocument = (index: number) => {
    const updatedDocuments = [...documents];
    updatedDocuments.splice(index, 1);
    
    onUpdate({
      documents: updatedDocuments
    });
  };

  return (
    <div className="space-y-6">
      {documents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Nenhum documento adicionado</p>
          <Button 
            onClick={handleAddDocument} 
            variant="outline" 
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Documento
          </Button>
        </div>
      ) : (
        <>
          {documents.map((document: any, index: number) => (
            <div key={index} className="p-4 border rounded-md bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Documento {index + 1}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDocument(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                  <Select
                    value={document.document_type}
                    onValueChange={(value) => handleDocumentChange(index, "document_type", value)}
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
                    onChange={(e) => handleDocumentChange(index, "document_number", e.target.value)}
                    placeholder={`Digite o ${document.document_type}`}
                  />
                </div>

                {document.document_type !== "CPF" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Órgão Emissor</label>
                    <Input
                      value={document.issuing_body || ""}
                      onChange={(e) => handleDocumentChange(index, "issuing_body", e.target.value)}
                      placeholder="Digite o órgão emissor"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          <Button 
            onClick={handleAddDocument} 
            variant="outline" 
            className="flex items-center mt-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Outro Documento
          </Button>
        </>
      )}
    </div>
  );
};

export default DocumentsForm;
