import { Report, ReportListProps } from '@/types/report';

export default function ReportList({ reports, onSelectReport }: ReportListProps) {
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
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                보고서 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                사고 유형
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                위치
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                상세보기
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {reports.map((report) => (
              <tr key={report.report_id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  #{report.report_id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {report.accident_type || '분석 예정'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {report.location}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span className={getStatusBadge(report.analysis_status)}>
                    {report.analysis_status === 'analyzing' ? '분석중' : 
                     report.analysis_status === 'completed' ? '완료' : '실패'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <button 
                    onClick={() => onSelectReport(report)}
                    className="text-primary hover:text-primary-dark"
                  >
                    상세보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}