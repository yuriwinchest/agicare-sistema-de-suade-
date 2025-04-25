
import React from "react";
import { Input } from "@/components/ui/input";

interface ContactFormProps {
  data: any;
  onUpdate: (data: any) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ data, onUpdate }) => {
  const handleChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
        <Input
          value={data.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="(00) 00000-0000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Input
          type="email"
          value={data.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="exemplo@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
        <Input
          value={data.address || ""}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Digite o endereço completo"
        />
      </div>
    </div>
  );
};

export default ContactForm;
