import { setAuthToken, removeAuthToken } from '@/lib/utils/auth';
import { UserProfile } from '@/types/auth';

interface Credentials {
 id: string;
 password: string;
 email?: string;
}

interface AuthResponse {
 success: boolean;
 message?: string;
 userData?: {
   userId: number;
   username: string;
   email: string;
   isMaster: boolean;
 };
}

const API_BASE_URL =
 process.env.NODE_ENV === 'development'
   ? 'https://www.hwouu.shop'
   : process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.hwouu.shop';

export const registerUser = async (
 credentials: Credentials
): Promise<{ success: boolean; message?: string }> => {
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
     message: data.message || '회원가입에 실패했습니다. 다시 시도해주세요.',
   };
 } catch (error) {
   console.error('Registration error:', error);
   return {
     success: false,
     message: '서버와의 통신 중 오류가 발생했습니다.',
   };
 }
};

export const authenticateUser = async (
 credentials: Credentials
): Promise<AuthResponse> => {
 try {
   const response = await fetch(`${API_BASE_URL}/api/users/login`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       Accept: 'application/json',
     },
     credentials: 'include',
     body: JSON.stringify({
       username: credentials.id,
       password: credentials.password,
     }),
   });

   const data = await response.json();
   console.log('Server response:', data);

   if (!response.ok) {
     throw new Error(data.message || '로그인에 실패했습니다.');
   }

   if (data.accessToken) {
     setAuthToken(data.accessToken);
     document.cookie = `auth=${data.accessToken}; path=/; secure; samesite=strict`;
     document.cookie = `authToken=${data.accessToken}; path=/; secure; samesite=strict`;

     // username이 'master'인 경우 관리자 권한 부여
     const isMasterUser = data.username === 'master';

     const userInfo = {
       id: data.userID,
       email: data.email || '',
       nickname: data.username || credentials.id,
       userType: isMasterUser ? 'admin' : 'user',
       isMaster: isMasterUser
     };

     localStorage.setItem('userInfo', JSON.stringify(userInfo));

     return { 
       success: true,
       userData: {
         userId: data.userID,
         username: data.username,
         email: data.email,
         isMaster: isMasterUser
       }
     };
   }

   return {
     success: false,
     message: '인증 토큰을 받지 못했습니다.'
   };
 } catch (error) {
   console.error('Authentication error:', error);
   return {
     success: false,
     message: error instanceof Error ? error.message : '서버와의 통신 중 오류가 발생했습니다.'
   };
 }
};

export const logout = async (): Promise<void> => {
 try {
   const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
     method: 'POST',
     credentials: 'include',
     headers: {
       'Content-Type': 'application/json',
     },
   });

   removeAuthToken();
   localStorage.removeItem('userInfo');

   window.location.href = '/login';
 } catch (error) {
   console.error('Logout error:', error);
   removeAuthToken();
   localStorage.removeItem('userInfo');
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
       Authorization: `Bearer ${localStorage.getItem('authToken')}`,
     },
   });

   if (!response.ok) {
     throw new Error('Token validation failed');
   }

   return true;
 } catch (error) {
   console.error('Token validation error:', error);
   removeAuthToken();
   return false;
 }
};

export const getCurrentUser = async (): Promise<UserProfile | null> => {
 try {
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