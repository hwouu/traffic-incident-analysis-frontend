export interface Vehicle {
  type: string;
  color: string;
  damage: string;
}

export interface AccidentType {
  type: string;
  severity: string;
}

export interface DamagedSituation {
  damage: string;
  injury: string;
}

export interface Report {
  report_id: string;
  user_id: number;
  date: string;
  time: string;
  location: string;
  accident_type: AccidentType;
  damaged_situation: DamagedSituation;
  number_of_vehicle: number;
  vehicle: Vehicle[];
  description: string | null;
  fileUrl: string[] | null;
  fileType: string | null;
  created_at: string;
  updated_at: string;
}