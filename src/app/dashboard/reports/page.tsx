// src/app/dashboard/reports/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, List, Loader2 } from 'lucide-react';
import type { Report } from '@/types/report';
import { reportsApi } from '@/lib/api/reports';
import ReportList from '@/components/reports/ReportList';
import ReportGrid from '@/components/reports/ReportGrid';
import ReportModal from '@/components/reports/ReportModal';

export default function ReportsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const fetchedReports = await reportsApi.getReports();
        setReports(fetchedReports);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '보고서를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.accident_type.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || report.accident_type.type === selectedType;
    return matchesSearch && matchesType;
  });

  const uniqueAccidentTypes = Array.from(
    new Set(reports.map((report) => report.accident_type.type))
  );

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">사고 분석 보고서</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              생성된 사고 분석 보고서를 확인할 수 있습니다.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-2 ${
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-2 ${
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="보고서 검색..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">모든 유형</option>
            {uniqueAccidentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {viewMode === 'list' ? (
        <ReportList reports={filteredReports} onSelectReport={setSelectedReport} />
      ) : (
        <ReportGrid reports={filteredReports} onSelectReport={setSelectedReport} />
      )}

      {selectedReport && (
        <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}