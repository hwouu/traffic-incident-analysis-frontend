import { useState, useRef, useCallback } from 'react';

interface WebcamState {
  stream: MediaStream | null;
  chunks: Blob[];
  mediaRecorder: MediaRecorder | null;
}

interface UseWebcamReturn {
  isRecording: boolean;
  isUploading: boolean;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob>;
  cleanup: () => void;
}

const DEFAULT_VIDEO_CONFIG = {
  video: {
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  }
};

export const useWebcam = (): UseWebcamReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const streamState = useRef<WebcamState>({
    stream: null,
    chunks: [],
    mediaRecorder: null
  });

  const startRecording = useCallback(async () => {
    try {
      if (!streamState.current.stream) {
        const stream = await navigator.mediaDevices.getUserMedia(DEFAULT_VIDEO_CONFIG);
        streamState.current.stream = stream;
      }

      streamState.current.chunks = [];
      const mediaRecorder = new MediaRecorder(streamState.current.stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          streamState.current.chunks.push(event.data);
        }
      };

      mediaRecorder.start(100);
      streamState.current.mediaRecorder = mediaRecorder;
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('웹캠을 시작할 수 없습니다. 카메라 권한을 확인해주세요.');
      throw err;
    }
  }, []);

  const stopRecording = useCallback(() => {
    return new Promise<Blob>((resolve, reject) => {
      const mediaRecorder = streamState.current.mediaRecorder;
      
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        reject(new Error('녹화가 시작되지 않았습니다.'));
        return;
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(streamState.current.chunks, { type: 'video/mp4' });
        streamState.current.chunks = [];
        setIsRecording(false);
        resolve(blob);
      };

      mediaRecorder.stop();
    });
  }, []);

  const cleanup = useCallback(() => {
    if (streamState.current.mediaRecorder?.state !== 'inactive') {
      streamState.current.mediaRecorder?.stop();
    }

    if (streamState.current.stream) {
      streamState.current.stream.getTracks().forEach(track => track.stop());
    }

    streamState.current = {
      stream: null,
      chunks: [],
      mediaRecorder: null
    };

    setIsRecording(false);
    setIsUploading(false);
    setError(null);
  }, []);

  return {
    isRecording,
    isUploading,
    error,
    startRecording,
    stopRecording,
    cleanup
  };
};