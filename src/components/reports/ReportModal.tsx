import { Report } from '@/types/report';
import { format } from 'date-fns';
import { X } from 'lucide-react';

interface ReportModalProps {
  report: Report;
  onClose: () => void;
}

export default function ReportModal({ report, onClose }: ReportModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {report.accident_name || '분석 예정'}
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            보고서 #{report.report_id}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">사고 유형</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {report.accident_type || '분석 예정'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">위치</p>
            <p className="font-medium text-gray-900 dark:text-white">{report.location}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">발생 일시</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {format(new Date(`${report.date} ${report.time}`), 'yyyy년 MM월 dd일 HH:mm:ss')}
            </p>
          </div>
          {report.vehicle_1_type && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">차량 1</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {report.vehicle_1_color} {report.vehicle_1_type}
              </p>
            </div>
          )}
          {report.vehicle_2_type && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">차량 2</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {report.vehicle_2_color} {report.vehicle_2_type}
              </p>
            </div>
          )}
        </div>

        {report.accident_detail && (
          <div className="mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">사고 상세</p>
            <p className="mt-2 whitespace-pre-wrap text-gray-900 dark:text-white">
              {report.accident_detail}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}