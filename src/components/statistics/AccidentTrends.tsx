// src/components/statistics/AccidentTrends.tsx
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useState } from 'react';
import type { Report } from '@/types/report';

interface AccidentTrendsProps {
  reports: Report[];
}

export default function AccidentTrends({ reports }: AccidentTrendsProps) {
  const [view, setView] = useState<'monthly' | 'weekly'>('monthly');

  // 월별 데이터 계산
  const getMonthlyData = () => {
    const monthlyStats = reports.reduce((acc, report) => {
      const date = new Date(report.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          total: 0,
          severe: 0,
          moderate: 0,
          minor: 0,
        };
      }
      
      acc[monthKey].total += 1;
      switch (report.accident_type.severity) {
        case '심각':
          acc[monthKey].severe += 1;
          break;
        case '보통':
          acc[monthKey].moderate += 1;
          break;
        case '경미':
          acc[monthKey].minor += 1;
          break;
      }
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyStats).sort((a, b) => a.month.localeCompare(b.month));
  };

  // 요일별 데이터 계산
  const getWeeklyData = () => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weeklyStats = reports.reduce((acc, report) => {
      const date = new Date(report.date);
      const day = weekdays[date.getDay()];
      
      if (!acc[day]) {
        acc[day] = {
          day,
          count: 0,
          severe: 0,
        };
      }
      
      acc[day].count += 1;
      if (report.accident_type.severity === '심각') {
        acc[day].severe += 1;
      }
      
      return acc;
    }, {} as Record<string, any>);

    return weekdays.map(day => weeklyStats[day] || { day, count: 0, severe: 0 });
  };

  const monthlyData = getMonthlyData();
  const weeklyData = getWeeklyData();

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white">
          사고 발생 추이
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setView('monthly')}
            className={`rounded-lg px-3 py-1 text-sm ${
              view === 'monthly'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            월별
          </button>
          <button
            onClick={() => setView('weekly')}
            className={`rounded-lg px-3 py-1 text-sm ${
              view === 'weekly'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            요일별
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {view === 'monthly' ? (
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                name="전체"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="severe"
                stroke="#ef4444"
                name="심각"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" name="전체 사고" />
              <Bar dataKey="severe" fill="#ef4444" name="심각 사고" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}