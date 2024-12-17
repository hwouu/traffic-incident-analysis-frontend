// src/components/reports/ReportGrid.tsx
import { Report } from '@/types/report';
import { format } from 'date-fns';
import { Car, MapPin, Trash2, AlertCircle } from 'lucide-react';
import { generateReportTitle, getStatusBadge } from '@/lib/utils/report';
import Image from 'next/image';
import { useState } from 'react';

interface ReportGridProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onDeleteReport?: (report: Report) => void;
}

const formatLocation = (location: string) => {
  const parts = location.split(' ');
  return parts.slice(0, 2).join(' ');
};

export default function ReportGrid({ reports, onSelectReport, onDeleteReport }: ReportGridProps) {
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <div 
            key={report.report_id} 
            className="group relative flex h-full cursor-pointer flex-col rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
            onClick={() => onSelectReport(report)}
          >
            {/* 상단 영역: 보고서 ID와 심각도 */}
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                #{report.report_id}
              </span>
              <span className={getStatusBadge(report.accident_type.severity)}>
                {report.accident_type.severity}
              </span>
            </div>
            
            {/* 보고서 제목 */}
            <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-primary dark:text-white dark:group-hover:text-primary">
              {generateReportTitle(report)}
            </h3>

            {/* 정보 영역 */}
            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Car className="h-4 w-4" />
                  <span>{report.number_of_vehicle}대</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{formatLocation(report.location)}</span>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(report.date), 'yyyy.MM.dd')}
              </span>
            </div>

            {/* 이미지 갤러리 */}
            {report.fileType === 'image' && report.fileUrl && report.fileUrl.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {report.fileUrl.slice(0, 4).map((url, idx) => (
                  <div key={url} className="relative aspect-square overflow-hidden rounded-md">
                    <Image
                      src={url}
                      alt={`미리보기 ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 20vw"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 하단 영역: 사고 유형과 삭제 버튼 */}
            <div className="mt-auto flex items-center justify-between pt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {report.accident_type.type}
              </div>
              {onDeleteReport && (
                <button
                  onClick={(e) => handleDeleteClick(e, report)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:bg-gray-700 dark:hover:bg-red-900"
                  aria-label="보고서 삭제"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
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