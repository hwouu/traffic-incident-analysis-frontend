import { setAuthToken, removeAuthToken } from '@/lib/utils/auth';
import { UserProfile } from '@/types/auth';

interface Credentials {
  id: string;
  password: string;
  email?: string;
}

interface AuthResponse {
  accessToken: string;
  message: string;
}

// 개발 환경과 프로덕션 환경에 따른 API URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.hwouu.shop';

export const registerUser = async (credentials: Credentials): Promise<{success: boolean; message?: string}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: credentials.id,
        password: credentials.password,
        email: credentials.email,
      }),
    });

    const data = await response.json();
    console.log('Registration response:', data);

    if (response.ok) {
      console.log('User registered successfully');
      return { success: true };
    }
    
    return { 
      success: false, 
      message: data.message || '회원가입에 실패했습니다. 다시 시도해주세요.' 
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      message: '서버와의 통신 중 오류가 발생했습니다.' 
    };
  }
};

export const authenticateUser = async (credentials: Credentials): Promise<{success: boolean; message?: string}> => {
  try {
    console.log('Attempting to authenticate with URL:', `${API_BASE_URL}/api/users/login`);
    
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: credentials.id,
        password: credentials.password,
      }),
    });

    const data = await response.json();
    console.log('Authentication response:', data);

    if (!response.ok) {
      throw new Error(data.message || '로그인에 실패했습니다.');
    }

    if (data.accessToken) {
      setAuthToken(data.accessToken);
      // 사용자 정보도 localStorage에 저장
      localStorage.setItem('userInfo', JSON.stringify({
        id: 1,
        email: credentials.email || '',
        nickname: credentials.id,  // username을 nickname으로 사용
        userType: 'user'
      }));
      return { success: true };
    }

    return { 
      success: false, 
      message: '인증 토큰을 받지 못했습니다.' 
    };

  } catch (error) {
    console.error('Authentication error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return {
        success: false,
        message: '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.'
      };
    }
    return { 
      success: false, 
      message: error instanceof Error ? error.message : '서버와의 통신 중 오류가 발생했습니다.' 
    };
  }
};

export const logout = async (): Promise<void> => {
  try {
    // 서버에 로그아웃 요청 보내기 (선택적)
    const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // 로컬 토큰과 사용자 정보 제거
    removeAuthToken();
    localStorage.removeItem('userInfo');  // 추가된 부분
    
    // 로그인 페이지로 리다이렉트
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
    // 에러가 발생해도 로컬 토큰과 사용자 정보는 제거하고 로그인 페이지로 이동
    removeAuthToken();
    localStorage.removeItem('userInfo');  // 추가된 부분
    window.location.href = '/login';
  }
};

export const validateToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/validate`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      }
    });
    
    if (!response.ok) {
      throw new Error('Token validation failed');
    }
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    // 토큰 검증 실패 시 로그아웃 처리
    removeAuthToken();
    return false;
  }
};

export const getCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    // localStorage에서 사용자 정보 가져오기
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      return null;
    }
    return JSON.parse(userInfo);
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};