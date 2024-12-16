// src/lib/api/chatbot.ts

import { getAuthToken } from '@/lib/utils/auth';
import type {
  ChatBotAnalysisResponse,
  Report,
  UploadFilesResponse,
  StreamUploadResponse
} from '@/types/report';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.hwouu.shop';

/**
 * 사고 상황을 분석하고 초기 리포트를 생성합니다.
 */
export const analyzeSituation = async (description: string): Promise<ChatBotAnalysisResponse> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('인증이 필요합니다.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/chatbot/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ description })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '분석 요청에 실패했습니다.');
    }

    return response.json();
  } catch (error) {
    console.error('Analyze situation error:', error);
    throw error instanceof Error ? error : new Error('분석 중 오류가 발생했습니다.');
  }
};

/**
 * 이미지나 비디오 파일을 업로드합니다.
 */
export const uploadFiles = async (
  files: File[],
  onProgress?: (progress: number) => void,
  reportId?: string,
  userId?: number
): Promise<UploadFilesResponse> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('인증이 필요합니다.');
  }

  if (!reportId || !userId) {
    throw new Error('reportId와 userId는 필수입니다.');
  }

  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  formData.append('reportId', reportId);
  formData.append('userId', userId.toString());

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(new Error('서버 응답을 처리할 수 없습니다.'));
        }
      } else {
        reject(new Error('파일 업로드에 실패했습니다.'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('네트워크 오류가 발생했습니다.'));
    });

    xhr.open('PUT', `${API_BASE_URL}/api/files/upload`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  });
};

/**
 * 웹캠 녹화 영상을 업로드합니다.
 */
export const uploadStreamVideo = async (
  videoBlob: Blob,
  reportId: string,
  userId: number
): Promise<StreamUploadResponse> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('인증이 필요합니다.');
  }

  try {
    const formData = new FormData();
    formData.append('video', videoBlob, 'recording.mp4');
    formData.append('reportId', reportId);
    formData.append('userId', userId.toString());

    const response = await fetch(`${API_BASE_URL}/api/stream/upload`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '스트림 업로드에 실패했습니다.');
    }

    return response.json();
  } catch (error) {
    console.error('Stream upload error:', error);
    throw error instanceof Error ? error : new Error('스트림 업로드 중 오류가 발생했습니다.');
  }
};

/**
 * 최종 분석 결과를 업데이트합니다.
 */
export const updateDescription = async (
  reportId: string,
  fileUrl: string[],
  fileType: 'image' | 'video'
): Promise<{ message: string; report: Report }> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('인증이 필요합니다.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/chatbot/update-description`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        report_id: reportId,
        fileUrl,
        fileType
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '분석 결과 업데이트에 실패했습니다.');
    }

    return response.json();
  } catch (error) {
    console.error('Update description error:', error);
    throw error instanceof Error ? error : new Error('분석 결과 업데이트 중 오류가 발생했습니다.');
  }
};