// src/components/reports/ReportList.tsx
import { Report } from '@/types/report';
import { format } from 'date-fns';
import { Car, MapPin } from 'lucide-react';
import { generateReportTitle, getStatusBadge } from '@/lib/utils/report';

interface ReportListProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
}

export default function ReportList({ reports, onSelectReport }: ReportListProps) {
  return (
    <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                보고서 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                발생일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                차량
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                발생 위치
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                심각도
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {reports.map((report) => (
              <tr 
                key={report.report_id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => onSelectReport(report)}
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  #{report.report_id}
                </td>
                <td className="max-w-md px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {generateReportTitle(report)}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {format(new Date(report.date), 'yyyy.MM.dd')}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                    <Car className="h-4 w-4" />
                    <span>{report.number_of_vehicle}대</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                    <MapPin className="h-4 w-4" />
                    <span>{report.location}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span className={getStatusBadge(report.accident_type.severity)}>
                    {report.accident_type.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
