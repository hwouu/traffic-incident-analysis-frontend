// src/components/statistics/DetailedStats.tsx
'use client';

import { useState, useMemo } from 'react';
import { Calendar, Search, ArrowUpDown } from 'lucide-react';
import type { Report } from '@/types/report';

interface DetailedStatsProps {
  reports: Report[];
}

type SortKey = 'date' | 'location' | 'severity' | 'vehicles';
type SortOrder = 'asc' | 'desc';

export default function DetailedStats({ reports }: DetailedStatsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: SortKey; order: SortOrder}>({
    key: 'date',
    order: 'desc'
  });
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'week'>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  // 날짜 필터링
  const filterByDate = (reports: Report[]) => {
    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    
    return reports.filter(report => {
      const reportDate = new Date(report.date);
      const daysDiff = Math.floor((now.getTime() - reportDate.getTime()) / msPerDay);

      switch (selectedPeriod) {
        case 'week':
          return daysDiff <= 7;
        case 'month':
          return daysDiff <= 30;
        default:
          return true;
      }
    });
  };

  // 정렬 및 필터링된 데이터
  const filteredReports = useMemo(() => {
    let filtered = filterByDate(reports);

    // 심각도 필터링
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(
        report => report.accident_type?.severity === selectedSeverity
      );
    }

    // 검색어 필터링
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        report =>
          report.location.toLowerCase().includes(term) ||
          report.description.toLowerCase().includes(term) ||
          report.accident_type.type.toLowerCase().includes(term)
      );
    }

    // 정렬
    return filtered.sort((a, b) => {
      switch (sortConfig.key) {
        case 'date':
          return sortConfig.order === 'desc'
            ? new Date(b.date).getTime() - new Date(a.date).getTime()
            : new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'location':
          return sortConfig.order === 'desc'
            ? b.location.localeCompare(a.location)
            : a.location.localeCompare(b.location);
        case 'severity':
          const severityOrder = { '심각': 3, '보통': 2, '경미': 1 };
          return sortConfig.order === 'desc'
            ? severityOrder[b.accident_type.severity as keyof typeof severityOrder] - 
              severityOrder[a.accident_type.severity as keyof typeof severityOrder]
            : severityOrder[a.accident_type.severity as keyof typeof severityOrder] - 
              severityOrder[b.accident_type.severity as keyof typeof severityOrder];
        case 'vehicles':
          return sortConfig.order === 'desc'
            ? b.number_of_vehicle - a.number_of_vehicle
            : a.number_of_vehicle - b.number_of_vehicle;
        default:
          return 0;
      }
    });
  }, [reports, searchTerm, sortConfig, selectedPeriod, selectedSeverity]);

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white">
          상세 통계
        </h3>

        <div className="flex flex-wrap gap-3">
          {/* 기간 필터 */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as 'all' | 'month' | 'week')}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="all">전체 기간</option>
              <option value="month">최근 1개월</option>
              <option value="week">최근 1주일</option>
            </select>
          </div>

          {/* 심각도 필터 */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="all">모든 심각도</option>
            <option value="심각">심각</option>
            <option value="보통">보통</option>
            <option value="경미">경미</option>
          </select>

          {/* 검색 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th 
                onClick={() => handleSort('date')}
                className="cursor-pointer py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center gap-1">
                  날짜
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('location')}
                className="cursor-pointer py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center gap-1">
                  위치
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('severity')}
                className="cursor-pointer py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center gap-1">
                  심각도
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('vehicles')}
                className="cursor-pointer py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center gap-1">
                  관련 차량
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                사고 내용
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr
                key={report.report_id}
                className="border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
              >
                <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                  {new Date(report.date).toLocaleDateString()}
                </td>
                <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                  {report.location}
                </td>
                <td className="py-3 text-sm">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      report.accident_type.severity === '심각'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : report.accident_type.severity === '보통'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}
                  >
                    {report.accident_type.severity}
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                  {report.number_of_vehicle}대
                </td>
                <td className="max-w-md py-3 text-sm text-gray-600 dark:text-gray-300">
                  <p className="truncate">{report.description}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredReports.length === 0 && (
          <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            데이터가 없습니다
          </div>
        )}
      </div>

      {/* 페이지 요약 */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        총 {filteredReports.length}건의 사고 데이터
      </div>
    </div>
  );
}