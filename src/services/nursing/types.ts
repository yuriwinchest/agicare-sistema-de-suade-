
export interface VitalSigns {
  temperature: string;
  pressure: string;
  pulse: string;
  respiratory: string;
  oxygen: string;
  pain_scale?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  date?: string;
  time?: string;
}

export interface NursingEvolution {
  date: string;
  time: string;
  evolution: string;
  previousEvolutions?: EvolutionEntry[];
}

export interface EvolutionEntry {
  id: string;
  date: string;
  time: string;
  evolution: string;
}

export interface HydricBalance {
  date?: string;
  intakeRecords?: Array<{id: string, type: string, volume: string, time: string}>;
  outputRecords?: Array<{id: string, type: string, volume: string, time: string}>;
  totalIntake?: string;
  totalOutput?: string;
  balance?: string;
}

export interface NursingAssessment {
  vitalSigns?: VitalSigns;
  evolution?: NursingEvolution;
  hydricBalance?: HydricBalance;
  lastUpdate?: string;
  completedBy?: string;
}
