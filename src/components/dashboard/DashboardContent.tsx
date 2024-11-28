'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, MessageSquareText, FileText } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/auth';
import type { UserProfile } from '@/types/auth';
import Link from 'next/link';

export default function DashboardContent() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      {/* Welcome Section */}
      <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 md:p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white md:text-2xl">
          안녕하세요, {user?.nickname || '사용자'}님
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 md:text-base">
          교통사고 분석 시스템에 오신 것을 환영합니다.
        </p>

        {/* Quick Access Buttons */}
        <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link
            href="/dashboard/analysis/chat"
            className="flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600 md:text-base"
          >
            <MessageSquareText className="mr-2 h-5 w-5" />
            사고 신고 챗봇 시작
          </Link>
          <Link
            href="/dashboard/reports"
            className="flex items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-sm text-white transition-colors hover:bg-green-600 md:text-base"
          >
            <FileText className="mr-2 h-5 w-5" />
            보고서 목록 확인
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 md:p-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">진행 중인 분석</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">2</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 md:p-6">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">대기 중</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">1</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 md:p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">분석 완료</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="p-4 md:p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            최근 분석 내역
          </h3>
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 md:px-6">
                    분석 일시
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 md:px-6">
                    위치
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 md:px-6">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200 md:px-6">
                    2024-11-08 14:30
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200 md:px-6">
                    서울시 강남구
                  </td>
                  <td className="px-4 py-4 text-sm md:px-6">
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/30">
                      분석 중
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200 md:px-6">
                    2024-11-07 09:15
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200 md:px-6">
                    서울시 송파구
                  </td>
                  <td className="px-4 py-4 text-sm md:px-6">
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/30">
                      완료
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}