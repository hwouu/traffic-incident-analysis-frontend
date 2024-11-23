import { setAuthToken, removeAuthToken } from '@/lib/utils/auth';

interface Credentials {
  id: string;
  password: string;
  email?: string;
}

interface AuthResponse {
  accessToken: string;
  message: string;
}

const API_BASE_URL = 'http://52.79.53.159:3000';

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
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: credentials.id,
        password: credentials.password,
      }),
    });

    const data = await response.json();
    console.log('Authentication response:', data);

    if (response.ok && data.accessToken) {
      console.log('User authenticated successfully:', data);
      setAuthToken(data.accessToken);
      return { success: true };
    }

    return { 
      success: false, 
      message: data.message || '로그인에 실패했습니다. 다시 시도해주세요.' 
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { 
      success: false, 
      message: '서버와의 통신 중 오류가 발생했습니다.' 
    };
  }
};

export const logout = () => {
  try {
    removeAuthToken();
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const validateToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/validate`, {
      method: 'GET',
      credentials: 'include',
    });
    return response.ok;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};