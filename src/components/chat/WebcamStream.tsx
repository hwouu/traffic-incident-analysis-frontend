'use client';

import { useRef, useEffect, useState } from 'react';
import { Camera, StopCircle, Upload, Loader2, RefreshCcw } from 'lucide-react';
import { getAuthToken } from '@/lib/utils/auth';
import type { WebcamStreamProps } from '@/types/webcam';

export default function WebcamStream({
  onError,
  onUploadSuccess,
  className = '',
}: WebcamStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const initWebcam = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('웹캠 초기화 오류:', error);
      onError?.('웹캠을 시작할 수 없습니다. 카메라 권한을 허용해주세요.');
    }
  };

  useEffect(() => {
    initWebcam();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      chunksRef.current = [];
      setRecordedBlob(null);
    };
  }, []);

  const startRecording = () => {
    if (!streamRef.current) {
      initWebcam();
      return;
    }

    setIsReviewing(false);
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9'
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedBlob(blob);
      setIsReviewing(true);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = URL.createObjectURL(blob);
        videoRef.current.play().catch(console.error);
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(1000);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setIsRecording(false);
    }
  };

  const restartRecording = () => {
    setIsReviewing(false);
    setRecordedBlob(null);
    if (videoRef.current) {
      videoRef.current.src = '';
    }
    initWebcam();
  };

  const handleUpload = async () => {
    if (!recordedBlob) {
      onError?.('업로드할 영상이 없습니다.');
      return;
    }

    try {
      setIsUploading(true);
      const token = getAuthToken();

      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      // 파일 이름 생성
      const filename = `recording-${Date.now()}.webm`;
      const file = new File([recordedBlob], filename, { type: 'video/webm' });

      if (onUploadSuccess) {
        onUploadSuccess(URL.createObjectURL(file));
      }

      setRecordedBlob(null);
      setIsReviewing(false);
      initWebcam();
    } catch (error) {
      console.error('Upload error:', error);
      onError?.(error instanceof Error ? error.message : '영상 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      <div className="relative h-[300px] w-full md:h-[600px]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={!isReviewing}
          controls={isReviewing}
          className="h-full w-full rounded-lg bg-black object-cover"
        />
        {isRecording && (
          <div className="absolute bottom-2 left-2 flex items-center space-x-2 rounded-full bg-red-500 px-3 py-1 text-xs text-white md:text-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
            <span>녹화중</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center space-y-2 md:flex-row md:space-x-4 md:space-y-0">
        {!isReviewing ? (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex w-full items-center justify-center space-x-2 rounded-lg px-6 py-3 text-sm font-medium md:w-auto ${
              isRecording
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={isUploading}
          >
            {isRecording ? (
              <>
                <StopCircle className="h-5 w-5" />
                <span>녹화 중지</span>
              </>
            ) : (
              <>
                <Camera className="h-5 w-5" />
                <span>녹화 시작</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex w-full flex-col space-y-2 md:w-auto md:flex-row md:space-x-4 md:space-y-0">
            <button
              onClick={restartRecording}
              className="flex items-center space-x-2 rounded-lg bg-gray-500 px-6 py-3 text-sm font-medium text-white hover:bg-gray-600"
              disabled={isUploading}
            >
              <RefreshCcw className="h-5 w-5" />
              <span>다시 녹화</span>
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`flex items-center space-x-2 rounded-lg px-6 py-3 text-sm font-medium ${
                isUploading
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>업로드 중...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>영상 전송</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}