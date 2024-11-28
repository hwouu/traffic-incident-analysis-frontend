'use client';

import { useRef, useEffect, useState } from 'react';
import { Camera, StopCircle, Upload, Loader2, RefreshCcw } from 'lucide-react';
import { getAuthToken, removeAuthToken } from '@/lib/utils/auth';
import type { WebcamStreamProps, UploadResponse } from '@/types/webcam';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.hwouu.shop';

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
      if (onError) {
        onError('웹캠을 시작할 수 없습니다. 카메라 권한을 허용해주세요.');
      }
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
    const mediaRecorder = new MediaRecorder(streamRef.current);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
      setRecordedBlob(blob);
      setIsReviewing(true);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = URL.createObjectURL(blob);
        videoRef.current.play().catch(console.error);
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(100);
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
      if (onError) onError('업로드할 영상이 없습니다.');
      return;
    }

    try {
      setIsUploading(true);
      const token = getAuthToken();

      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const formData = new FormData();
      const fileName = `recording-${Date.now()}.mp4`;
      formData.append('video', recordedBlob, fileName);

      console.log('Starting upload process...');
      console.log('File details:', {
        name: fileName,
        size: `${(recordedBlob.size / 1024 / 1024).toFixed(2)}MB`,
        type: recordedBlob.type,
      });

      const response = await fetch(`${API_BASE_URL}/api/stream/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Server response status:', response.status);
      console.log('Server response status text:', response.statusText);

      const responseText = await response.text();
      console.log('Raw server response:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Parsed response data:', responseData);
      } catch (e) {
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error('서버 응답을 처리할 수 없습니다.');
      }

      if (!response.ok) {
        console.error('Upload failed with status:', response.status);
        console.error('Error details:', responseData);

        if (response.status === 401) {
          removeAuthToken();
          window.location.href = '/login';
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
        }

        const errorMessage = responseData.error || responseData.message || '업로드에 실패했습니다.';
        console.error('Error message:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('Upload success:', responseData);

      if (responseData.path && onUploadSuccess) {
        onUploadSuccess(responseData.path);
      }

      setRecordedBlob(null);
      setIsReviewing(false);
      initWebcam();
    } catch (error) {
      console.error('Upload process error:', {
        message: error instanceof Error ? error.message : '알 수 없는 오류',
        error: error,
      });

      if (onError) {
        const errorMessage =
          error instanceof Error ? error.message : '영상 업로드 중 오류가 발생했습니다.';
        onError(errorMessage);
      }
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
          playsInline // 모바일에서 전체화면 방지
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