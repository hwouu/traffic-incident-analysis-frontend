export interface Report {
  report_id: string;
  case_id: string;
  accident_type: string;
  location: string;
  date: string;
  time: string;
  analysis_status: 'analyzing' | 'completed' | 'failed';
  accident_name?: string;
  vehicle_1_type?: string;
  vehicle_1_color?: string;
  vehicle_2_type?: string;
  vehicle_2_color?: string;
  accident_detail?: string;
}

export interface ReportListProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
}

export type ViewMode = 'list' | 'grid';