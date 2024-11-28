import { Report, ReportListProps } from '@/types/report';
import { format } from 'date-fns';

export default function ReportGrid({ reports, onSelectReport }: ReportListProps) {
  const getStatusBadge = (status: Report['analysis_status']) => {
    const baseClasses = "rounded-full px-2 py-1 text-xs font-semibold";
    switch (status) {
      case 'analyzing':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <div key={report.report_id} className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              보고서 #{report.report_id}
            </span>
            <span className={getStatusBadge(report.analysis_status)}>
              {report.analysis_status === 'analyzing' ? '분석중' : 
               report.analysis_status === 'completed' ? '완료' : '실패'}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
            {report.accident_name || '분석 예정'}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {report.location}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(`${report.date} ${report.time}`), 'yyyy년 MM월 dd일')}
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