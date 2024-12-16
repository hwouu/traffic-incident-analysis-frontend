// src/types/report/index.ts
export interface Vehicle {
  type: string;
  color: string;
  damage: string;
 }
 
 export interface AccidentType {
  type: string;
  severity: '경미' | '보통' | '심각';
 }
 
 export interface DamagedSituation {
  damage: string;
  injury: string;
 }
 
 export interface Report {
  report_id: string;
  user_id: number;
  date: string;
  time: string;
  location: string;
  accident_type: AccidentType;
  damaged_situation: DamagedSituation;
  number_of_vehicle: number;
  vehicle: Vehicle[];
  description: string;
  fileUrl: string[] | null;
  created_at: string;
  updated_at: string;
  fileType: 'image' | 'video' | null;
 }
 
 export interface ReportListProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
 }
 
 export interface ChatBotAnalysis {
  분석결과: {
    사고날짜: string;
    사고시간: string;
    사고장소: string;
  };
  추가질문: string;
 }
 
 export interface ChatBotAnalysisResponse {
  message: string;
  data: {
    analysis: ChatBotAnalysis;
    report: {
      message: string;
      report: Report;
    };
  };
 }
 
 export interface UploadFilesResponse {
  message: string;
  report: Report;
 }
 
 export interface StreamUploadResponse {
  message: string;
  updatedReport: Report;
 }
 
 // 챗봇 메시지 관련 타입
 export interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'error';
  content: string;
  timestamp: Date;
 }
 
 // 챗봇 Phase 상태를 위한 타입
 export type ChatPhase = 1 | 2 | 3;
 
 // 챗봇 컴포넌트 Props 타입
 export interface ChatInterfaceProps {
  onAnalysisStart?: () => void;
  onAnalysisEnd?: () => void;
 }