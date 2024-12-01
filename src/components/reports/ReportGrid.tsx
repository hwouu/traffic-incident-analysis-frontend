import { Report, ReportListProps } from '@/types/report';
import { format } from 'date-fns';
import { Car } from 'lucide-react';
import { generateReportTitle, getStatusBadge } from '@/lib/utils/report';
import Image from 'next/image';

export default function ReportGrid({ reports, onSelectReport }: ReportListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <div
          key={report.report_id}
          className="group cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
          onClick={() => onSelectReport(report)}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              #{report.report_id}
            </span>
            <span className={getStatusBadge(report.accident_type.severity)}>
              {report.accident_type.severity}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-primary dark:text-white dark:group-hover:text-primary">
            {generateReportTitle(report)}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{report.location}</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{format(new Date(report.date), 'yyyy년 MM월 dd일')}</span>
            <div className="flex items-center gap-1">
              <Car className="h-4 w-4" />
              <span>{report.number_of_vehicle}대</span>
            </div>
          </div>
          {report.fileType === 'image' && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {report.fileUrl?.slice(0, 4).map((url, idx) => (
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
        </div>
      ))}
    </div>
  );
}
