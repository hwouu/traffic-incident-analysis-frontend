import { getAuthToken } from '@/lib/utils/auth';
import type { UploadResponse } from '@/types/webcam';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.hwouu.shop';

export const uploadWebcamRecording = async (
  videoBlob: Blob,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
    }

    const formData = new FormData();
    const fileName = `recording-${Date.now()}.mp4`;
    formData.append('video', videoBlob, fileName);

    console.log('Uploading file:', fileName);
    console.log('File size:', videoBlob.size, 'bytes');

    // XMLHttpRequest를 사용하여 업로드 진행률 추적
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log('Upload success:', response);
          resolve({
            message: response.message,
            path: response.path
          });
        } else {
          reject(new Error('업로드에 실패했습니다.'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('네트워크 오류가 발생했습니다.'));
      });

      xhr.open('POST', `${API_BASE_URL}/api/stream/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.withCredentials = true;
      xhr.send(formData);
    });
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const deleteRecording = async (fileUrl: string): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await fetch(`${API_BASE_URL}/api/stream/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({ fileUrl })
    });

    return response.ok;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};