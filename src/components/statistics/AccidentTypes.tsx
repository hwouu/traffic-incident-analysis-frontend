// src/components/statistics/AccidentTypes.tsx
'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import type { Report } from '@/types/report';

interface AccidentTypesProps {
  reports: Report[];
}

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#6366f1', '#8b5cf6'];

export default function AccidentTypes({ reports }: AccidentTypesProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  // 사고 유형별 통계
  const getAccidentTypeStats = () => {
    const stats = reports.reduce((acc, report) => {
      const type = report.accident_type?.type || '기타';
      if (!acc[type]) {
        acc[type] = {
          name: type,
          value: 0,
          severe: 0,
          moderate: 0,
          minor: 0
        };
      }
      acc[type].value += 1;
      
      // 심각도별 카운트
      switch (report.accident_type?.severity) {
        case '심각':
          acc[type].severe += 1;
          break;
        case '보통':
          acc[type].moderate += 1;
          break;
        case '경미':
          acc[type].minor += 1;
          break;
      }
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(stats);
  };

  const typeStats = getAccidentTypeStats();

  // 심각도별 통계 데이터
  const severityData = typeStats.map(stat => ({
    name: stat.name,
    심각: stat.severe,
    보통: stat.moderate,
    경미: stat.minor
  }));

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg bg-white p-3 shadow-lg dark:bg-gray-800">
          <p className="mb-2 font-medium">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: item.fill }}>
              {item.name}: {item.value}건
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
      <h3 className="mb-6 text-base font-semibold text-gray-800 dark:text-white">
        사고 유형 분석
      </h3>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 도넛 차트 */}
        <div className="h-[300px]">
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">사고 유형 분포</p>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {typeStats.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    opacity={activeIndex === index ? 0.8 : 1}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg bg-white p-3 shadow-lg dark:bg-gray-800">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm text-gray-500">
                          {data.value}건 ({((data.value / reports.length) * 100).toFixed(1)}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 스택 바 차트 */}
        <div className="h-[300px]">
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">유형별 심각도 분포</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={severityData}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 40, bottom: 0 }}
            >
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip content={customTooltip} />
              <Bar dataKey="심각" stackId="a" fill="#ef4444" />
              <Bar dataKey="보통" stackId="a" fill="#f59e0b" />
              <Bar dataKey="경미" stackId="a" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 범례 */}
        <div className="col-span-full mt-4 flex flex-wrap justify-center gap-4">
          {typeStats.map((stat, index) => (
            <div key={stat.name} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {stat.name} ({stat.value}건)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}