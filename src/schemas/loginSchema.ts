
import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string()
    .min(1, { message: "Senha é obrigatória" })
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
