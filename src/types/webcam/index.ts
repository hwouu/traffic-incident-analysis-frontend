// 웹캠 설정 관련 타입
export interface WebcamConfig {
  video: {
    width: { ideal: number };
    height: { ideal: number };
  };
}

// 녹화 상태 관련 타입
export interface RecordingStatus {
  isRecording: boolean;
  isUploading: boolean;
  error: string | null;
}

// 웹캠 스트림 상태 관련 타입
export interface WebcamStreamState {
  stream: MediaStream | null;
  chunks: Blob[];
  mediaRecorder: MediaRecorder | null;
}

// 서버 응답 관련 타입
export interface UploadResponse {
  message: string;
  path: string;
  error?: string;
}

export interface UploadErrorResponse {
  message: string;
  error?: string;
  stack?: string;
}

// 인증 헤더 관련 타입
export interface WebcamAuthHeaders {
  Authorization: string;
  'Content-Type': string;
}

// 컴포넌트 Props 타입
export interface WebcamStreamProps {
  onRecordingStart?: () => void;
  onRecordingStop?: (recordingUrl: string) => void;
  onError?: (error: string) => void;
  onUploadSuccess?: (path: string) => void;
  className?: string;
}

// 업로드 진행 상태 타입
export interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
}