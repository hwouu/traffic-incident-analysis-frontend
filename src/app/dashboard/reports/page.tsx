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
  ChevronDown,
  X,
  Filter,
  RefreshCw,
} from 'lucide-react';

import ReportList from '@/components/reports/ReportList';
import ReportGrid from '@/components/reports/ReportGrid';
import ReportModal from '@/components/reports/ReportModal';
import { reportsApi } from '@/lib/api/reports';
import { generateReportTitle } from '@/lib/utils/report';
import { Toaster, toast } from 'react-hot-toast';
import type { Report, SortField } from '@/types/report';

export default function ReportsPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // 초기 데이터 로드
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

  // 필터 초기화 함수
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedLocations([]);
    setSelectedSeverity('');
    setSortField('date');
    setSortOrder('desc');
  };

  // 필터링 로직
  const filteredReports = reports.filter((report) => {
    const title = generateReportTitle(report).toLowerCase();
    const firstLocationWord = report.location.split(' ')[0];

    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || report.accident_type.type === selectedType;
    const matchesLocations =
      selectedLocations.length === 0 ||
      (firstLocationWord && selectedLocations.includes(firstLocationWord));
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
      return sortOrder === 'desc'
        ? b.location.localeCompare(a.location)
        : a.location.localeCompare(b.location);
    }
  });

  // 고유 값 목록 추출
  const uniqueAccidentTypes = Array.from(
    new Set(reports.map((report) => report.accident_type.type))
  );
  const uniqueLocations = Array.from(
    new Set(reports.map((report) => report.location.split(' ')[0]))
  ).sort();
  const uniqueSeverities = Array.from(
    new Set(reports.map((report) => report.accident_type.severity))
  );

  // 선택된 필터 개수 계산
  const activeFiltersCount = [selectedType, ...selectedLocations, selectedSeverity].filter(
    Boolean
  ).length;

  // 삭제 핸들러
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
      {/* 헤더 영역 */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">사고 분석 보고서</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            생성된 사고 분석 보고서를 확인할 수 있습니다.
          </p>
        </div>

        {/* 상단 컨트롤 영역 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Filter className="h-4 w-4" />
            필터
            {activeFiltersCount > 0 && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* 뷰 모드 토글 */}
          <div className="flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center px-3 py-2 ${
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center px-3 py-2 ${
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 필터 패널 */}
      {showFilters && (
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex flex-col space-y-4">
            {/* 검색 및 필터 초기화 */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="보고서 검색..."
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <RefreshCw className="h-4 w-4" />
                  초기화
                </button>
              )}
            </div>

            {/* 필터 그룹 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* 사고 유형 필터 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  사고 유형
                </label>
                <div className="flex flex-wrap gap-2">
                  {uniqueAccidentTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(selectedType === type ? '' : type)}
                      className={`rounded-full px-3 py-1 text-sm transition-colors ${
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

              {/* 지역 필터 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">지역</label>
                <div className="location-filter relative">
                  {' '}
                  {/* location-filter 클래스 추가 */}
                  <button
                    onClick={() => setShowLocationFilter(!showLocationFilter)}
                    className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
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
                        <div
                          key={location}
                          className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            const isSelected = selectedLocations.includes(location);
                            if (isSelected) {
                              setSelectedLocations(
                                selectedLocations.filter((loc) => loc !== location)
                              );
                            } else {
                              setSelectedLocations([...selectedLocations, location]);
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedLocations.includes(location)}
                            onChange={() => {}} // React에서는 controlled component를 위해 빈 핸들러 필요
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{location}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 심각도 필터 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  심각도
                </label>
                <div className="flex rounded-lg border border-gray-300 p-1 dark:border-gray-600">
                  {uniqueSeverities.map((severity) => (
                    <button
                      key={severity}
                      onClick={() =>
                        setSelectedSeverity(selectedSeverity === severity ? '' : severity)
                      }
                      className={`flex-1 rounded-md px-3 py-1.5 text-sm transition-colors ${
                        selectedSeverity === severity
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {severity}
                    </button>
                  ))}
                </div>
              </div>

              {/* 정렬 필드 선택 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">정렬</label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-gray-700">
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value as SortField)}
                    className="flex-1 bg-transparent text-sm text-gray-700 focus:outline-none dark:text-gray-200"
                  >
                    <option value="date">날짜순</option>
                    <option value="severity">심각도순</option>
                    <option value="location">지역순</option>
                  </select>
                  <button
                    onClick={() => setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'))}
                    className="rounded-md p-1 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    aria-label={sortOrder === 'asc' ? '내림차순으로 변경' : '오름차순으로 변경'}
                  >
                    {sortOrder === 'asc' ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 선택된 필터 표시 */}
            {(selectedType || selectedLocations.length > 0 || selectedSeverity) && (
              <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
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
        </div>
      )}

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
          sortConfig={{ field: sortField, order: sortOrder }}
          onSort={(field: SortField) => {
            if (field === sortField) {
              setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'));
            } else {
              setSortField(field);
              setSortOrder('desc');
            }
          }}
        />
      )}

      {/* 선택된 보고서 모달 */}
      {selectedReport && (
        <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}

      <Toaster position="top-center" />
    </div>
  );
}
