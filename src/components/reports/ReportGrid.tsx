import { Report } from '@/types/report';
import { format } from 'date-fns';
import { Car, MapPin } from 'lucide-react';
import { generateReportTitle, getStatusBadge } from '@/lib/utils/report';
import Image from 'next/image';

interface ReportGridProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
}

const formatLocation = (location: string) => {
  const parts = location.split(' ');
  return parts.slice(0, 2).join(' ');
};

export default function ReportGrid({ reports, onSelectReport }: ReportGridProps) {
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