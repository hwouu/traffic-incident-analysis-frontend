// src/components/statistics/StatisticsOverview.tsx
'use client';

import { Car, AlertTriangle, Users, Calendar } from 'lucide-react';
import type { Report } from '@/types/report';

interface StatCardProps {
 title: string;
 value: number | string;
 icon: React.ElementType;
 description?: string;
 trend?: number;
 colorClass: string;
}

const StatCard = ({ title, value, icon: Icon, description, colorClass }: StatCardProps) => (
 <div className={`rounded-xl ${colorClass} p-6 shadow-sm`}>
   <div className="flex items-start justify-between">
     <div>
       <p className="text-sm font-medium text-white">{title}</p>
       <p className="mt-2 text-3xl font-bold text-white">{value}</p>
       {description && (
         <p className="mt-1 text-xs text-white/70">{description}</p>
       )}
     </div>
     <span className="rounded-lg bg-white/10 p-2.5">
       <Icon className="h-6 w-6 text-white" />
     </span>
   </div>
 </div>
);

interface StatisticsOverviewProps {
 reports: Report[];
}

export default function StatisticsOverview({ reports }: StatisticsOverviewProps) {
 // 통계 계산
 const calculateStats = () => {
   const totalAccidents = reports.length;
   
   // 심각 사고 건수
   const severeCases = reports.filter(r => 
     r.accident_type && r.accident_type.severity === '심각'
   ).length;
   
   // 고유한 날짜 수
   const uniqueDates = new Set(reports.map(r => r.date.split('T')[0])).size;
   
   // 부상자/사망자 수 계산
   const casualties = reports.reduce((acc, report) => {
     if (!report.damaged_situation) {
       return acc;
     }

     const injuryText = report.damaged_situation.damage;
     const deaths = injuryText.match(/사망자\s*(\d+)명/);
     const injuries = injuryText.match(/(중상자|경상자)\s*(\d+)명/g);
     
     acc.deaths += deaths ? parseInt(deaths[1]) : 0;
     if (injuries) {
       injuries.forEach(injury => {
         const count = parseInt(injury.match(/\d+/)?.[0] || '0');
         acc.injuries += count;
       });
     }
     return acc;
   }, { deaths: 0, injuries: 0 });

   return {
     totalAccidents,
     severeCases,
     uniqueDates,
     casualties
   };
 };

 const stats = calculateStats();

 return (
   <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
     <StatCard
       title="총 사고 건수"
       value={stats.totalAccidents}
       icon={Car}
       colorClass="bg-gradient-to-br from-blue-600 to-blue-700"
       description="전체 분석된 사고 수"
     />
     <StatCard
       title="심각 사고"
       value={stats.severeCases}
       icon={AlertTriangle}
       colorClass="bg-gradient-to-br from-red-600 to-red-700"
       description={`전체의 ${((stats.severeCases / stats.totalAccidents) * 100).toFixed(1)}%`}
     />
     <StatCard
       title="총 사상자"
       value={`${stats.casualties.deaths + stats.casualties.injuries}명`}
       icon={Users}
       colorClass="bg-gradient-to-br from-amber-600 to-amber-700"
       description={`사망 ${stats.casualties.deaths}명, 부상 ${stats.casualties.injuries}명`}
     />
     <StatCard
       title="분석 일수"
       value={stats.uniqueDates}
       icon={Calendar}
       colorClass="bg-gradient-to-br from-emerald-600 to-emerald-700"
       description="총 분석된 날짜 수"
     />
   </div>
 );
}