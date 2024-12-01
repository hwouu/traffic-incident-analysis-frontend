// src/components/reports/ReportModal.tsx
import { Report } from '@/types/report';
import { format } from 'date-fns';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Car,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Users,
  Siren,
  Bot,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { generateReportTitle } from '@/lib/utils/report';

interface ReportModalProps {
  report: Report;
  onClose: () => void;
}

export default function ReportModal({ report, onClose }: ReportModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? (report.fileUrl?.length || 1) - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === (report.fileUrl?.length || 1) - 1 ? 0 : prev + 1));
  };

  const MediaSection = () => {
    if (!report.fileUrl || report.fileUrl.length === 0) return null;

    if (report.fileType === 'video') {
      return (
        <div className="rounded-lg bg-gray-100 p-6 dark:bg-gray-900">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <video
              src={report.fileUrl[0]}
              controls
              className="h-full w-full"
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            >
              <source src={report.fileUrl[0]} type="video/mp4" />
              브라우저가 비디오 재생을 지원하지 않습니다.
            </video>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-lg bg-gray-100 p-6 dark:bg-gray-900">
        <div className="relative">
          <div className="relative aspect-video h-[400px] w-full overflow-hidden rounded-lg">
            <Image
              src={report.fileUrl[currentImageIndex]}
              alt={`사고 현장 이미지 ${currentImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
          </div>

          <button
            onClick={() => setIsImageExpanded(true)}
            className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            <Maximize2 className="h-5 w-5" />
          </button>

          {report.fileUrl.length > 1 && (
            <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 justify-between px-4">
              <button
                onClick={handlePrevImage}
                className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>

        {report.fileUrl.length > 1 && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                사고 현장 이미지 ({currentImageIndex + 1} / {report.fileUrl.length})
              </h4>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {report.fileUrl.map((url, index) => (
                <button
                  key={url}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative flex-shrink-0 ${
                    currentImageIndex === index ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70'
                  }`}
                >
                  <div className="relative h-20 w-32">
                    <Image
                      src={url}
                      alt={`썸네일 ${index + 1}`}
                      fill
                      className="rounded-lg object-cover"
                      sizes="128px"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <div className="relative my-4 w-full max-w-6xl rounded-lg bg-white p-6 dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-6 w-6" />
        </button>

        {/* 헤더 섹션 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {generateReportTitle(report)}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            보고서 ID: {report.report_id} | 생성일:{' '}
            {format(new Date(report.created_at), 'yyyy년 MM월 dd일 HH:mm')}
          </p>
        </div>

        {/* 정보 섹션 */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            {/* 기본 정보 카드 */}
            <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
              <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                <AlertCircle className="mr-2 h-5 w-5 text-primary" />
                사고 정보
              </h3>
              <div className="grid gap-4">
                <div className="flex items-center">
                  <MapPin className="mr-3 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">위치</p>
                    <p className="text-gray-900 dark:text-white">{report.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-3 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">발생일</p>
                    <p className="text-gray-900 dark:text-white">
                      {format(new Date(report.date), 'yyyy년 MM월 dd일')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-3 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      발생 시각
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {format(new Date(report.time), 'HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 사고 분석 카드 */}
            <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
              <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                <Siren className="mr-2 h-5 w-5 text-primary" />
                사고 분석
              </h3>
              <div className="grid gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">사고 유형</p>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {report.accident_type.type} (심각도: {report.accident_type.severity})
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">차량 피해</p>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {report.damaged_situation.damage}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">인명 피해</p>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {report.damaged_situation.injury}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* 차량 정보 카드 */}
          <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                <Car className="mr-2 h-5 w-5 text-primary" />
                관련 차량 정보
              </h3>
              <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4" />총 {report.number_of_vehicle}대
              </span>
            </div>
            {/* 스크롤 가능한 컨테이너 추가 */}
            <div className="max-h-[400px] overflow-y-auto pr-2">
              <div className="grid gap-4">
                {report.vehicle.map((vehicle, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">차량 {index + 1}</p>
                    <div className="mt-2 grid gap-2 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">유형: </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {vehicle.type}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">색상: </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {vehicle.color}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">피해: </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {vehicle.damage}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GPT 분석 결과 */}
        {report.description && (
          <div className="mb-8 rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                사고 분석 결과
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Bot className="h-4 w-4" />
                Powered by ChatGPT
              </div>
            </div>
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {report.description}
            </p>
          </div>
        )}

        {/* 미디어 섹션 */}
        <MediaSection />

        {/* 이미지 확대 모달 */}
        {isImageExpanded && report.fileType === 'image' && report.fileUrl && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-90">
            <button
              onClick={() => setIsImageExpanded(false)}
              className="absolute right-4 top-4 text-white hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative h-[90vh] w-[90vw]">
              <Image
                src={report.fileUrl[currentImageIndex]}
                alt={`사고 현장 이미지 ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
              {currentImageIndex + 1} / {report.fileUrl.length}
            </div>
            <button
              onClick={handlePrevImage}
              className="absolute left-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
