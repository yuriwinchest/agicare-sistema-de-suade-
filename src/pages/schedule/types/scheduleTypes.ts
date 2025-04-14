
export interface ScheduleItem {
  id: number;
  code: number;
  description: string;
  scheduleType: string;
  serviceType: string;
  professional: string;
  position: string;
  unit: string;
}

export interface ScheduleHour {
  id: number;
  day: string;
  startDate: string;
  endDate: string;
  startHour: string;
  endHour: string;
}
