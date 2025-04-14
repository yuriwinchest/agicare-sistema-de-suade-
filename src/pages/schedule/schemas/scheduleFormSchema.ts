
import { z } from "zod";

export const scheduleFormSchema = z.object({
  code: z.string().min(1, "Código é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  scheduleType: z.string().min(1, "Tipo de escala é obrigatório"),
  serviceType: z.string().min(1, "Tipo de serviço é obrigatório"),
  centerLocation: z.string().min(1, "Centro/Local é obrigatório"),
  professional: z.string().min(1, "Profissional é obrigatório"),
  position: z.string().min(1, "Função é obrigatória"),
  frequency: z.string().optional(),
  capacity: z.string().optional(),
  calendarConfig: z.string().optional(),
  serviceConfig: z.string().optional(),
});

export const scheduleHourSchema = z.object({
  day: z.string().min(1, "Dia é obrigatório"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  startHour: z.string().min(1, "Hora inicial é obrigatória"),
  endHour: z.string().min(1, "Hora final é obrigatória"),
});
