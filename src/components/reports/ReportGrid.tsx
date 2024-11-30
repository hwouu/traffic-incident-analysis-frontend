
// src/components/reports/ReportGrid.tsx
import { Report } from '@/types/report';
import { format } from 'date-fns';

interface ReportGridProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
}

export default function ReportGrid({ reports, onSelectReport }: ReportGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <div key={report.report_id} className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              보고서 #{report.report_id}
            </span>
            <span className={`rounded-full px-2 py-1 text-xs font-semibold 
              ${report.accident_type.severity === '경미' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : report.accident_type.severity === '보통'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {report.accident_type.severity}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
            {report.accident_type.type}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {report.location}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(report.date), 'yyyy년 MM월 dd일')}
            </span>
            <button
              onClick={() => onSelectReport(report)}
              className="rounded-lg bg-primary px-3 py-1 text-sm text-white hover:bg-primary-dark"
            >
              상세보기
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
