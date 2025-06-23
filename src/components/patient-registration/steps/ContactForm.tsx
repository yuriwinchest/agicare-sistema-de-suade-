import React from "react";
import { Input } from "@/components/ui/input";
import { StandardLabel } from "@/components/ui/FormLabel";

/**
 * ContactForm
 * Responsabilidade: Formulário de contato do paciente
 * Princípios: DRY - Usa componentes reutilizáveis para labels
 */

interface ContactFormProps {
  data: any;
  onUpdate: (data: any) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ data, onUpdate }) => {
  const handleChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.');
      onUpdate({
        [parentField]: {
          ...(data[parentField] || {}),
          [childField]: value
        }
      });
    } else {
      onUpdate({ [field]: value });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <StandardLabel>Telefone</StandardLabel>
        <Input
          value={data.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="(00) 00000-0000"
        />
      </div>

      <div>
        <StandardLabel>Email</StandardLabel>
        <Input
          type="email"
          value={data.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="exemplo@email.com"
        />
      </div>

      <div>
        <StandardLabel>Endereço</StandardLabel>
        <Input
          value={data.address || ""}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Digite o endereço completo"
        />
      </div>

      <div>
        <StandardLabel optional>Complemento</StandardLabel>
        <Input
          value={(data.addressDetails?.complement) || ""}
          onChange={(e) => handleChange("addressDetails.complement", e.target.value)}
          placeholder="Complemento (apartamento, bloco, etc)"
        />
      </div>
    </div>
  );
};

export default ContactForm;
