// src/lib/utils/report.ts

import { Report } from '@/types/report';

export const generateReportTitle = (report: Report): string => {
  const location = report.location.split(' ')[1];  // 첫 번째 행정구역만 사용
  const accidentType = report.accident_type.type;
  const severity = report.accident_type.severity;
  
  // 차량 대수에 따른 문구
  const vehicleCount = report.number_of_vehicle > 1 
    ? `${report.number_of_vehicle}중 ` 
    : '';

  // 심각도에 따른 추가 문구
  const severityPrefix = severity === '심각' 
    ? '심각한 ' 
    : '';

  return `${location}에서 발생한 ${severityPrefix}${vehicleCount}${accidentType}사고`;
};

export const getStatusBadge = (severity: string) => {
  const baseClasses = "rounded-full px-2 py-1 text-xs font-semibold";
  switch (severity) {
    case '경미':
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
    case '보통':
      return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
    case '심각':
      return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
  }
};