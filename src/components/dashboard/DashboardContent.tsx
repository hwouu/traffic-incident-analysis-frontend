// src/components/dashboard/DashboardContent.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  MessageSquareText,
  FileText,
  BarChart3,
  Car,
  AlertTriangle,
  Users,
  ChevronRight,
  Trophy,
  Clock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Image from 'next/image';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/auth';
import { reportsApi } from '@/lib/api/reports';
import type { UserProfile } from '@/types/auth';
import type { Report } from '@/types/report';

export default function DashboardContent() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, reportsData] = await Promise.all([
          getCurrentUser(),
          reportsApi.getReports(),
        ]);
        if (userData) setUser(userData);
        setReports(reportsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터 로딩 중 오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 통계 데이터 계산
  const stats = {
    total: reports.length,
    severe: reports.filter((r) => r.accident_type.severity === '심각').length,
    moderate: reports.filter((r) => r.accident_type.severity === '보통').length,
    minor: reports.filter((r) => r.accident_type.severity === '경미').length,
  };

  // 월별 데이터 계산
  const monthlyData = reports.reduce(
    (acc, report) => {
      const month = new Date(report.date).getMonth();
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  const chartData = Array.from({ length: 12 }, (_, month) => ({
    name: `${month + 1}월`,
    건수: monthlyData[month] || 0,
  }));

  const quickAccessCards = [
    {
      title: '사고 분석',
      description: 'AI 기반 사고 분석 챗봇',
      icon: MessageSquareText,
      link: '/dashboard/analysis/chat',
      bgColor: 'bg-blue-500',
      image: '/images/dashboard/menu-cards/chat.png',
    },
    {
      title: '보고서',
      description: '분석 보고서 조회 및 관리',
      icon: FileText,
      link: '/dashboard/reports',
      bgColor: 'bg-amber-500',
      image: '/images/dashboard/menu-cards/reports.png',
    },
    {
      title: '통계',
      description: '보고서 기반 통계 확인',
      icon: BarChart3,
      link: '/dashboard/statistics',
      bgColor: 'bg-indigo-500',
      image: '/images/dashboard/menu-cards/statistics.png',
    },
    {
      title: '실시간 교통',
      description: '도로교통공사 기반 실시간 교통 상황 확인',
      icon: Car,
      link: '/dashboard/traffic',
      bgColor: 'bg-emerald-500',
      image: '/images/dashboard/menu-cards/traffic.png',
    },
    {
      title: '사고 현황',
      description: '전국 사고 현황 확인',
      icon: AlertTriangle,
      link: '/dashboard/accident',
      bgColor: 'bg-rose-500',
      image: '/images/dashboard/menu-cards/accident.png',
    },
    {
      title: '커뮤니티',
      description: '공지사항, 1:1 문의, FAQ',
      icon: Users,
      link: '/dashboard/community',
      bgColor: 'bg-purple-500',
      image: '/images/dashboard/menu-cards/community.png',
    },
  ];

  if (loading) return <div className="flex h-full items-center justify-center">로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 p-4 shadow-sm dark:from-amber-900/20 dark:to-amber-800/20 md:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">총 사고 분석</p>
              <p className="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-300 md:text-3xl">
                {stats.total}
              </p>
            </div>
            <span className="rounded-lg bg-amber-500/10 p-2 md:p-2.5">
              <Trophy className="h-5 w-5 text-amber-600 md:h-6 md:w-6" />
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-100 p-4 shadow-sm dark:from-red-900/20 dark:to-red-800/20 md:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">심각 사고</p>
              <p className="mt-2 text-2xl font-bold text-red-700 dark:text-red-300 md:text-3xl">
                {stats.severe}
              </p>
            </div>
            <span className="rounded-lg bg-red-500/10 p-2 md:p-2.5">
              <AlertTriangle className="h-5 w-5 text-red-600 md:h-6 md:w-6" />
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-4 shadow-sm dark:from-green-900/20 dark:to-green-800/20 md:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">경미 사고</p>
              <p className="mt-2 text-2xl font-bold text-green-700 dark:text-green-300 md:text-3xl">
                {stats.minor}
              </p>
            </div>
            <span className="rounded-lg bg-green-500/10 p-2 md:p-2.5">
              <Car className="h-5 w-5 text-green-600 md:h-6 md:w-6" />
            </span>
          </div>
        </div>
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart Section */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800 md:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">
              월별 사고 발생 현황
            </h3>
            <Link href="/dashboard/statistics" className="text-sm text-primary hover:underline">
              자세히 보기
            </Link>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="건수"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Analysis */}
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800 md:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">최근 분석</h3>
            <Link href="/dashboard/reports" className="text-sm text-primary hover:underline">
              전체보기
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            {reports.slice(0, 3).map((report) => (
              <div
                key={report.report_id}
                className="flex items-start gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-700"
              >
                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                    {report.location}의 사고
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(report.date).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    report.accident_type.severity === '심각'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30'
                      : report.accident_type.severity === '보통'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30'
                  }`}
                >
                  {report.accident_type.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {quickAccessCards.map((card) => (
          <Link
            key={card.title}
            href={card.link}
            className="group flex h-auto flex-row items-center rounded-xl bg-white p-3 shadow-sm transition-all hover:shadow-md dark:bg-gray-800 sm:flex sm:h-[140px] sm:flex-row sm:items-start sm:p-5"
          >
            {/* Image Section */}
            <div className="relative mr-2 h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg sm:mr-4 sm:h-20 sm:w-20">
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-all group-hover:scale-105"
              />
            </div>

            {/* Content Section */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="mb-1 flex items-center justify-between sm:mb-2">
                <span className={`rounded-lg ${card.bgColor} bg-opacity-90 p-1 sm:p-1.5`}>
                  <card.icon className="h-3 w-3 text-white sm:h-4 sm:w-4" />
                </span>
                <ChevronRight className="h-3 w-3 text-gray-400 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
              </div>

              <h3 className="text-xs font-semibold text-gray-800 dark:text-white sm:text-sm">
                {card.title}
              </h3>
              <p className="line-clamp-3 text-[10px] leading-tight text-gray-500 dark:text-gray-400 sm:line-clamp-2 sm:text-xs sm:leading-relaxed">
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
