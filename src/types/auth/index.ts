export interface KakaoAuthResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
}

export interface UserProfile {
  id: number;
  email: string;
  nickname: string;
  profileImage?: string;
  userType: 'user' | 'admin';
  isMaster: boolean;  // 추가
}