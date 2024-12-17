'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutGrid,
  List,
  Loader2,
  ArrowUp,
  ArrowDown,
  Search,
  MapPin,
  Car,
  ChevronDown,
  X,
} from 'lucide-react';
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

  // 새로운 필터링 상태들
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [showLocationFilter, setShowLocationFilter] = useState(false);

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
    const matchesLocations =
      selectedLocations.length === 0 ||
      selectedLocations.some((location) => report.location.includes(location));
    const matchesSeverity =
      selectedSeverity === '' || report.accident_type.severity === selectedSeverity;

    return matchesSearch && matchesType && matchesLocations && matchesSeverity;
  });

  // 정렬 로직
  const sortedAndFilteredReports = [...filteredReports].sort((a, b) => {
    if (sortField === 'date') {
      return sortOrder === 'desc'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortField === 'severity') {
      const severityOrder = { 경미: 1, 보통: 2, 심각: 3 };
      return sortOrder === 'desc'
        ? severityOrder[b.accident_type.severity] - severityOrder[a.accident_type.severity]
        : severityOrder[a.accident_type.severity] - severityOrder[b.accident_type.severity];
    } else {
      // location
      return sortOrder === 'desc'
        ? b.location.localeCompare(a.location)
        : a.location.localeCompare(b.location);
    }
  });

  // 고유 값 목록 추출
  const uniqueAccidentTypes = Array.from(
    new Set(reports.map((report) => report.accident_type.type))
  );
  const uniqueLocations = Array.from(new Set(reports.map((report) => report.location)));
  const uniqueSeverities = Array.from(
    new Set(reports.map((report) => report.accident_type.severity))
  );

  const handleDelete = async (report: Report) => {
    try {
      await reportsApi.deleteReport(report.report_id);
      setReports(reports.filter((r) => r.report_id !== report.report_id));
      if (selectedReport?.report_id === report.report_id) {
        setSelectedReport(null);
      }
      toast.success('보고서가 삭제되었습니다.');
    } catch (error) {
      toast.error('보고서 삭제에 실패했습니다.');
    }
  };

  // 클릭 이벤트 핸들러 - 외부 클릭 시 필터 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLocationFilter && !(event.target as Element).closest('.location-filter')) {
        setShowLocationFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLocationFilter]);

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
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">사고 분석 보고서</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            생성된 사고 분석 보고서를 확인할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 필터링 및 정렬 컨트롤 */}
      <div className="space-y-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
        {/* 검색바 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="보고서 검색..."
            className="w-full rounded-lg border border-gray-300 bg-transparent py-2 pl-10 pr-4 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:text-gray-100"
          />
        </div>

        {/* 필터 태그 영역 */}
        <div className="flex flex-wrap gap-2">
          {/* 사고 유형 필터 - 태그형 */}
          <div className="flex flex-wrap gap-2">
            {uniqueAccidentTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(selectedType === type ? '' : type)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  selectedType === type
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 필터 컨트롤 영역 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 지역 필터 - 멀티 체크박스 드롭다운 */}
          <div className="location-filter relative">
            <button
              onClick={() => setShowLocationFilter(!showLocationFilter)}
              className="flex w-full items-center justify-between rounded-lg border border-gray-300 px-4 py-2 text-left text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {selectedLocations.length > 0
                  ? `${selectedLocations.length}개 지역 선택됨`
                  : '지역 선택'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {showLocationFilter && (
              <div className="absolute left-0 right-0 top-full z-10 mt-2 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-600 dark:bg-gray-800">
                {uniqueLocations.map((location) => (
                  <label
                    key={location}
                    className="flex cursor-pointer items-center gap-2 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLocations([...selectedLocations, location]);
                        } else {
                          setSelectedLocations(selectedLocations.filter((l) => l !== location));
                        }
                      }}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{location}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 심각도 필터 - 세그먼트 컨트롤 */}
          <div className="flex rounded-lg border border-gray-300 p-1 dark:border-gray-600">
            {uniqueSeverities.map((severity) => (
              <button
                key={severity}
                onClick={() => setSelectedSeverity(selectedSeverity === severity ? '' : severity)}
                className={`flex-1 rounded-md px-3 py-1.5 text-sm transition-colors ${
                  selectedSeverity === severity
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {severity}
              </button>
            ))}
          </div>

          {/* 정렬 필드 선택 */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 p-2 dark:border-gray-600">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as 'date' | 'severity' | 'location')}
              className="flex-1 bg-transparent text-sm focus:outline-none dark:text-gray-100"
            >
              <option value="date">날짜순</option>
              <option value="severity">심각도순</option>
              <option value="location">지역순</option>
            </select>
            <button
              onClick={() => setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'))}
              className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={sortOrder === 'asc' ? '내림차순으로 변경' : '오름차순으로 변경'}
            >
              {sortOrder === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* 보기 방식 토글 */}
          <div className="flex rounded-lg border border-gray-300 p-1 dark:border-gray-600">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 text-sm ${
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              그리드
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 text-sm ${
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <List className="h-4 w-4" />
              리스트
            </button>
          </div>
        </div>

        {/* 선택된 필터 표시 */}
        {(selectedType || selectedLocations.length > 0 || selectedSeverity) && (
          <div className="flex flex-wrap gap-2">
            {selectedType && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                {selectedType}
                <X className="h-4 w-4 cursor-pointer" onClick={() => setSelectedType('')} />
              </span>
            )}
            {selectedLocations.map((location) => (
              <span
                key={location}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                {location}
                <X
                  className="h-4 w-4 cursor-pointer"
                  onClick={() =>
                    setSelectedLocations(selectedLocations.filter((l) => l !== location))
                  }
                />
              </span>
            ))}
            {selectedSeverity && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                {selectedSeverity}
                <X className="h-4 w-4 cursor-pointer" onClick={() => setSelectedSeverity('')} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* 보고서 목록 */}
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

      {/* 선택된 보고서 모달 */}
      {selectedReport && (
        <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}

      {/* 토스트 알림 */}
      <Toaster position="top-center" />
    </div>
  );
}
