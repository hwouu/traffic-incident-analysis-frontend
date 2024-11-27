'use client';

import { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Report } from '@/types/report';
import ReportList from '@/components/reports/ReportList';
import ReportGrid from '@/components/reports/ReportGrid';
import ReportModal from '@/components/reports/ReportModal';

const MOCK_REPORTS: Report[] = [
  {
    report_id: 'R0001',
    case_id: 'A0001',
    accident_type: '추돌 사고',
    location: '서울시 강남구 테헤란로 301',
    date: '2024-11-24',
    time: '19:24:40',
    analysis_status: 'completed',
    accident_name: '테헤란로에서 발생한 이중 추돌 사고',
    vehicle_1_type: 'sedan',
    vehicle_1_color: 'red',
    vehicle_2_type: 'suv',
    vehicle_2_color: 'white',
    accident_detail: '베이지색 세단인 차량 #1이 좌회전을 시도하던 교차로에서 교통사고가 발생했습니다. 회전하는 동안 적갈색 세단인 차량 #2가 차량 #1의 전면 좌측을 충돌했습니다.'
  }
];

export default function ReportsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const filteredReports = MOCK_REPORTS.filter(report => {
    const matchesSearch = report.accident_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || report.accident_type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">사고 분석 보고서</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              생성된 사고 분석 보고서를 확인할 수 있습니다.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="보고서 검색..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800"
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">모든 유형</option>
            <option value="추돌 사고">추돌 사고</option>
            <option value="접촉 사고">접촉 사고</option>
            <option value="전복 사고">전복 사고</option>
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