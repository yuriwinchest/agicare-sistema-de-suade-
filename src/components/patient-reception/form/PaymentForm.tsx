import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Wallet, Landmark, BanknoteIcon, QrCode } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface PaymentFormProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  healthPlanSelected: boolean;
}

export const paymentMethods = [
  { id: "HEALTH_INSURANCE", name: "Plano de Saúde", icon: <Landmark className="h-5 w-5" /> },
  { id: "CREDIT_CARD", name: "Cartão de Crédito", icon: <CreditCard className="h-5 w-5" /> },
  { id: "DEBIT_CARD", name: "Cartão de Débito", icon: <CreditCard className="h-5 w-5" /> },
  { id: "CASH", name: "Dinheiro", icon: <BanknoteIcon className="h-5 w-5" /> },
  { id: "PIX", name: "PIX", icon: <QrCode className="h-5 w-5" /> },
  { id: "BANK_TRANSFER", name: "Transferência Bancária", icon: <Wallet className="h-5 w-5" /> },
];

export const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentMethod,
  setPaymentMethod,
  amount,
  setAmount,
  notes,
  setNotes,
  healthPlanSelected
}) => {
  // Função para formatar o valor em reais
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const floatValue = parseInt(numericValue, 10) / 100;
    return floatValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Função para lidar com mudanças no valor
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setAmount(rawValue);
  };

  return (
    <Card className="border-teal-100">
      <CardHeader className="bg-teal-50/50">
        <CardTitle className="text-teal-700 text-lg flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Informações de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 mb-1">
              Forma de Pagamento
            </Label>
            <Select
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              disabled={healthPlanSelected}
            >
              <SelectTrigger id="payment-method" className="border-teal-500/30 focus-visible:ring-teal-500/30">
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem 
                    key={method.id} 
                    value={method.id}
                    disabled={method.id === "HEALTH_INSURANCE" && !healthPlanSelected}
                  >
                    <div className="flex items-center gap-2">
                      {method.icon}
                      <span>{method.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {healthPlanSelected && paymentMethod === "HEALTH_INSURANCE" && (
              <p className="text-xs text-teal-600 mt-1">
                O plano de saúde será utilizado como forma de pagamento
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Valor {healthPlanSelected && "(Coparticipação)"}
            </Label>
            <Input
              id="amount"
              type="text"
              placeholder="R$ 0,00"
              value={amount ? formatCurrency(amount) : ""}
              onChange={handleAmountChange}
              className="border-teal-500/30 focus-visible:ring-teal-500/30"
              disabled={healthPlanSelected && paymentMethod === "HEALTH_INSURANCE"}
            />
            {healthPlanSelected && paymentMethod === "HEALTH_INSURANCE" && (
              <p className="text-xs text-teal-600 mt-1">
                Valor coberto pelo plano de saúde
              </p>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor="payment-notes" className="block text-sm font-medium text-gray-700 mb-1">
            Observações de Pagamento
          </Label>
          <Textarea
            id="payment-notes"
            placeholder="Observações sobre o pagamento"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-20 border-teal-500/30 focus-visible:ring-teal-500/30"
          />
        </div>
      </CardContent>
    </Card>
  );
}; 