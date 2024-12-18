import { getAuthToken } from '@/lib/utils/auth';
import type { Report } from '@/types/report';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.hwouu.shop';

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export const reportsApi = {
  // 전체 보고서 조회
  getReports: async (): Promise<Report[]> => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new APIError(401, '인증 토큰이 없습니다. 다시 로그인해주세요.');
      }

      const response = await fetch(`${API_BASE_URL}/api/report`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new APIError(401, '인증이 만료되었습니다. 다시 로그인해주세요.');
        }
        const errorData = await response.json();
        throw new APIError(response.status, errorData.message || '보고서 조회에 실패했습니다.');
      }

      const data = await response.json();
      return data.reports || [];
    } catch (error) {
      console.error('Reports fetch error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new Error('보고서 조회 중 오류가 발생했습니다.');
    }
  },

  // 단일 보고서 조회
  getReportById: async (reportId: string): Promise<Report> => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new APIError(401, '인증 토큰이 없습니다. 다시 로그인해주세요.');
      }

      const response = await fetch(`${API_BASE_URL}/api/report/${reportId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new APIError(404, '해당 보고서를 찾을 수 없습니다.');
        }
        if (response.status === 401) {
          throw new APIError(401, '인증이 만료되었습니다. 다시 로그인해주세요.');
        }
        const errorData = await response.json();
        throw new APIError(response.status, errorData.message || '보고서 조회에 실패했습니다.');
      }

      const data = await response.json();
      return data.report;
    } catch (error) {
      console.error('Report fetch error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new Error('보고서 조회 중 오류가 발생했습니다.');
    }
  },

  // 보고서 삭제
  deleteReport: async (reportId: string): Promise<{ message: string }> => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new APIError(401, '인증 토큰이 없습니다. 다시 로그인해주세요.');
      }

      const response = await fetch(`${API_BASE_URL}/api/report/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new APIError(404, '해당 보고서를 찾을 수 없습니다.');
        }
        if (response.status === 401) {
          throw new APIError(401, '이 보고서를 삭제할 권한이 없습니다.');
        }
        if (response.status === 403) {
          throw new APIError(403, '이 보고서를 삭제할 권한이 없습니다.');
        }
        const errorData = await response.json();
        throw new APIError(response.status, errorData.message || '보고서 삭제에 실패했습니다.');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Report deletion error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new Error('보고서 삭제 중 오류가 발생했습니다.');
    }
  },

  // API 응답 타입 가드
  isErrorResponse: (data: any): data is { message: string } => {
    return typeof data === 'object' && data !== null && typeof data.message === 'string';
  }
};