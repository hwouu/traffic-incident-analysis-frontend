// src/components/reports/ReportList.tsx
import { Report } from '@/types/report';
import { format } from 'date-fns';
import { Car, MapPin, Trash2, AlertCircle } from 'lucide-react';
import { generateReportTitle, getStatusBadge } from '@/lib/utils/report';
import { useState } from 'react';

interface ReportListProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onDeleteReport?: (report: Report) => void;
}

export default function ReportList({ reports, onSelectReport, onDeleteReport }: ReportListProps) {
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, report: Report) => {
    e.stopPropagation();
    setReportToDelete(report);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (reportToDelete && onDeleteReport) {
      onDeleteReport(reportToDelete);
    }
    setReportToDelete(null);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReportToDelete(null);
  };

  if (reports.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">보고서가 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  보고서 ID
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  제목
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  발생일
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  차량
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  발생 위치
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  심각도
                </th>
                {onDeleteReport && (
                  <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    작업
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map((report) => (
                <tr 
                  key={report.report_id}
                  className="group cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
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
                  {onDeleteReport && (
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button
                        onClick={(e) => handleDeleteClick(e, report)}
                        className="text-gray-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                        aria-label="보고서 삭제"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {reportToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" 
          onClick={handleCancelDelete}
        >
          <div 
            className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800" 
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-2 text-red-500">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-semibold">보고서 삭제 확인</h3>
            </div>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              이 보고서를 삭제하시겠습니까?<br />
              <span className="mt-2 block text-sm text-red-500">
                이 작업은 되돌릴 수 없습니다.
              </span>
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}