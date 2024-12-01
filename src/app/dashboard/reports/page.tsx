// src/app/dashboard/reports/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutGrid, List, Loader2 } from 'lucide-react';
import { Report } from '@/types/report';
import ReportList from '@/components/reports/ReportList';
import ReportGrid from '@/components/reports/ReportGrid';
import ReportModal from '@/components/reports/ReportModal';
import { reportsApi } from '@/lib/api/reports';
import { generateReportTitle } from '@/lib/utils/report';

export default function ReportsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Auth state:', { user, authLoading }); // 디버깅용 로그

    if (!authLoading && !user) {
      console.log('Redirecting to login: no user found');
      router.push('/login');
      return;
    }

    const fetchReports = async () => {
      try {
        setLoading(true);
        const fetchedReports = await reportsApi.getReports();

        // 현재 로그인한 사용자의 보고서만 필터링
        const userReports = fetchedReports.filter((report) => report.user_id === user?.id);

        setReports(userReports);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '보고서를 불러오는데 실패했습니다.');
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReports();
    }
  }, [user, authLoading, router]);

  const filteredReports = reports.filter((report) => {
    const title = generateReportTitle(report).toLowerCase();
    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || report.accident_type.type === selectedType;
    return matchesSearch && matchesType;
  });

  const uniqueAccidentTypes = Array.from(
    new Set(reports.map((report) => report.accident_type.type))
  );

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-red-500">{error}</div>
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
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-2 ${
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
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

      {viewMode === 'grid' ? (
        <ReportGrid reports={filteredReports} onSelectReport={setSelectedReport} />
      ) : (
        <ReportList reports={filteredReports} onSelectReport={setSelectedReport} />
      )}

      {selectedReport && (
        <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}
