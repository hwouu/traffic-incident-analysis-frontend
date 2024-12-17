'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LayoutGrid, List, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { Report } from '@/types/report';
import ReportList from '@/components/reports/ReportList';
import ReportGrid from '@/components/reports/ReportGrid';
import ReportModal from '@/components/reports/ReportModal';
import { reportsApi } from '@/lib/api/reports';
import { generateReportTitle } from '@/lib/utils/report';
import { Toaster, toast } from 'react-hot-toast';

export default function ReportsPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<'date' | 'severity' | 'location'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const fetchedReports = await reportsApi.getReports();
        setReports(fetchedReports);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '보고서를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReports();
    }
  }, [user]);

  // 필터링 로직
  const filteredReports = reports.filter((report) => {
    const title = generateReportTitle(report).toLowerCase();
    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || report.accident_type.type === selectedType;
    const matchesLocation = selectedLocation === '' || report.location.includes(selectedLocation);
    const matchesSeverity = selectedSeverity === '' || report.accident_type.severity === selectedSeverity;
    
    return matchesSearch && matchesType && matchesLocation && matchesSeverity;
  });

  // 정렬 로직
  const sortedAndFilteredReports = [...filteredReports].sort((a, b) => {
    if (sortField === 'date') {
      return sortOrder === 'desc'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortField === 'severity') {
      const severityOrder = { '경미': 1, '보통': 2, '심각': 3 };
      return sortOrder === 'desc'
        ? severityOrder[b.accident_type.severity] - severityOrder[a.accident_type.severity]
        : severityOrder[a.accident_type.severity] - severityOrder[b.accident_type.severity];
    } else {  // location
      return sortOrder === 'desc'
        ? b.location.localeCompare(a.location)
        : a.location.localeCompare(b.location);
    }
  });

  // 고유 값 목록 추출
  const uniqueAccidentTypes = Array.from(new Set(reports.map((report) => report.accident_type.type)));
  const uniqueLocations = Array.from(new Set(reports.map((report) => report.location)));
  const uniqueSeverities = Array.from(
    new Set(reports.map((report) => report.accident_type.severity))
  );

  const handleDelete = async (report: Report) => {
    try {
      await reportsApi.deleteReport(report.report_id);
      setReports(reports.filter(r => r.report_id !== report.report_id));
      if (selectedReport?.report_id === report.report_id) {
        setSelectedReport(null);
      }
      toast.success('보고서가 삭제되었습니다.');
    } catch (error) {
      toast.error('보고서 삭제에 실패했습니다.');
    }
  };

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

        {/* 필터링 및 정렬 컨트롤 */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="보고서 검색..."
            className="flex-1 min-w-[200px] rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 min-w-[150px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">모든 사고 유형</option>
            {uniqueAccidentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 min-w-[150px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">모든 지역</option>
            {uniqueLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 min-w-[150px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">모든 심각도</option>
            {uniqueSeverities.map((severity) => (
              <option key={severity} value={severity}>
                {severity}
              </option>
            ))}
          </select>

          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as 'date' | 'severity' | 'location')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 min-w-[120px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="date">날짜순</option>
            <option value="severity">심각도순</option>
            <option value="location">지역순</option>
          </select>
          
          <button
            onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
            className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            aria-label={sortOrder === 'asc' ? '내림차순으로 변경' : '오름차순으로 변경'}
          >
            {sortOrder === 'asc' ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <ReportGrid 
          reports={sortedAndFilteredReports} 
          onSelectReport={setSelectedReport} 
          onDeleteReport={handleDelete}
        />
      ) : (
        <ReportList 
          reports={sortedAndFilteredReports} 
          onSelectReport={setSelectedReport}
          onDeleteReport={handleDelete}
        />
      )}

      {selectedReport && (
        <ReportModal 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)} 
          onDelete={() => handleDelete(selectedReport)}
        />
      )}
      
      <Toaster position="top-center" />
    </div>
  );
}