import { getAuthToken } from '@/lib/utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.hwouu.shop';

interface UploadResponse {
  message: string;
  files: string[];
}

export const uploadFiles = async (
  files: File[],
  onProgress?: (progress: number) => void,
  reportId?: string,
  userId?: number
): Promise<UploadResponse> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  
  if (reportId) {
    formData.append('reportId', reportId);
  }
  if (userId) {
    formData.append('userId', userId.toString());
  }

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
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            message: response.message,
            files: response.files || response.report?.fileUrl || []
          });
        } catch (error) {
          reject(new Error('서버 응답을 처리할 수 없습니다.'));
        }
      } else {
        reject(new Error('업로드에 실패했습니다.'));
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