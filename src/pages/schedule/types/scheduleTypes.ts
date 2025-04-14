
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

export interface Exam {
  id: string;
  name: string;
  laterality?: string;
  quantity: number;
}

export interface PatientResult {
  id: string;
  name: string;
  phone: string;
  document: string;
}
