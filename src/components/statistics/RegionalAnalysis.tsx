// src/components/statistics/RegionalAnalysis.tsx
'use client';

import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import { ArrowUpDown } from 'lucide-react';
import type { Report } from '@/types/report';

interface RegionalAnalysisProps {
  reports: Report[];
}

interface RegionData {
  region: string;
  total: number;
  severe: number;
  moderate: number;
  minor: number;
  recentAccident?: string;
  avgSeverity: number;
}

export default function RegionalAnalysis({ reports }: RegionalAnalysisProps) {
  const [sortBy, setSortBy] = useState<'total' | 'severe'>('total');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 지역별 데이터 계산
  const regionData = useMemo(() => {
    const data: Record<string, RegionData> = {};

    reports.forEach(report => {
      // 첫 번째 행정구역 추출 (예: "서울시 강남구" -> "서울")
      const region = report.location.split(' ')[0];

      if (!data[region]) {
        data[region] = {
          region,
          total: 0,
          severe: 0,
          moderate: 0,
          minor: 0,
          avgSeverity: 0,
        };
      }

      data[region].total += 1;

      // 심각도별 카운트
      switch (report.accident_type?.severity) {
        case '심각':
          data[region].severe += 1;
          break;
        case '보통':
          data[region].moderate += 1;
          break;
        case '경미':
          data[region].minor += 1;
          break;
      }

      // 가장 최근 사고 정보 업데이트
      const accidentDate = new Date(report.date);
      if (
        !data[region].recentAccident ||
        accidentDate > new Date(data[region].recentAccident)
      ) {
        data[region].recentAccident = report.date;
      }

      // 평균 심각도 계산 (심각: 3, 보통: 2, 경미: 1)
      data[region].avgSeverity =
        (data[region].severe * 3 + data[region].moderate * 2 + data[region].minor) /
        data[region].total;
    });

    return Object.values(data);
  }, [reports]);

  // 정렬된 데이터
  const sortedData = useMemo(() => {
    return [...regionData].sort((a, b) => {
      const compareValue = sortOrder === 'desc' ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy];
      return compareValue;
    });
  }, [regionData, sortBy, sortOrder]);

  // 정렬 토글
  const toggleSort = (key: 'total' | 'severe') => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
          <p className="mb-2 font-semibold">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-500">총 사고: {data.total}건</p>
            <p className="text-red-500">심각 사고: {data.severe}건</p>
            <p className="text-yellow-500">보통 사고: {data.moderate}건</p>
            <p className="text-green-500">경미 사고: {data.minor}건</p>
            <p className="mt-2 text-gray-500">
              최근 사고: {new Date(data.recentAccident).toLocaleDateString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white">지역별 분석</h3>
        <div className="flex gap-2">
          <button
            onClick={() => toggleSort('total')}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-colors ${
              sortBy === 'total'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            총 건수
            <ArrowUpDown className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleSort('severe')}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-colors ${
              sortBy === 'severe'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            심각 사고
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 차트 */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            margin={{ top: 20, right: 30, left: 40, bottom: 10 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="region" />
            <YAxis />
            <Tooltip content={customTooltip} />
            <Bar dataKey="total" fill="#3b82f6">
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`rgba(59, 130, 246, ${0.5 + (entry.avgSeverity / 3) * 0.5})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 지역별 상세 통계 테이블 */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                지역
              </th>
              <th className="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                총 사고
              </th>
              <th className="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                심각
              </th>
              <th className="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                보통
              </th>
              <th className="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                경미
              </th>
              <th className="py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                최근 사고
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((data) => (
              <tr
                key={data.region}
                className="border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
              >
                <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">
                  {data.region}
                </td>
                <td className="py-3 text-right text-sm text-gray-600 dark:text-gray-300">
                  {data.total}건
                </td>
                <td className="py-3 text-right text-sm text-red-600 dark:text-red-400">
                  {data.severe}건
                </td>
                <td className="py-3 text-right text-sm text-yellow-600 dark:text-yellow-400">
                  {data.moderate}건
                </td>
                <td className="py-3 text-right text-sm text-green-600 dark:text-green-400">
                  {data.minor}건
                </td>
                <td className="py-3 text-right text-sm text-gray-600 dark:text-gray-300">
                  {new Date(data.recentAccident!).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}