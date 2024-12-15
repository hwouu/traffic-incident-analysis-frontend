// src/app/dashboard/statistics/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { reportsApi } from '@/lib/api/reports';
import type { Report } from '@/types/report';
import StatisticsOverview from '@/components/statistics/StatisticsOverview';
import AccidentTrends from '@/components/statistics/AccidentTrends';
import AccidentTypes from '@/components/statistics/AccidentTypes';
import RegionalAnalysis from '@/components/statistics/RegionalAnalysis';
import DetailedStats from '@/components/statistics/DetailedStats';

export default function StatisticsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsData = await reportsApi.getReports();
        setReports(reportsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터 로딩 중 오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center">로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-8 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">사고 통계</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {user?.isMaster ? '전체 사고' : '내 사고'} 통계 분석 대시보드
        </p>
      </div>
      
      <StatisticsOverview reports={reports} />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AccidentTrends reports={reports} />
        <AccidentTypes reports={reports} />
      </div>
      
      <RegionalAnalysis reports={reports} />
      <DetailedStats reports={reports} />
    </div>
  );
}