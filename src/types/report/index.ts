// src/types/report/index.ts
export interface Vehicle {
  type: string;
  color: string;
  damage: string;
}

export interface AccidentType {
  type: string;
  severity: '경미' | '보통' | '심각';
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
  description: string;
  fileUrl: string[] | null;
  created_at: string;
  updated_at: string;
  fileType: 'image' | 'video' | null;
}

export interface ReportListProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
}