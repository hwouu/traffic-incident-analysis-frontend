import Cookies from 'js-cookie';

interface Credentials {
  id: string;
  password: string;
  email: string
}

export const registerUser = async (newUser: Credentials): Promise<{success: boolean; message?: string}> => {
  try {
    const response = await fetch('http://52.79.53.159:3000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: newUser.id,  
        password: newUser.password,
        email: newUser.email, 
      }),
    });

    const result = await response.json();
    console.log('서버 응답:', result);

    if (response.ok) {
      console.log('User registered successfully');
      return { success: true };
    } else {
      return { success: false, message: result.message || '회원가입에 실패했습니다. 다시 시도해주세요.' };
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: '서버와의 통신 중 오류가 발생했습니다.' };
  }
};

export const authenticateUser = async (credentials: Credentials): Promise<{success: boolean; message?: string}> => {
  try {
    const response = await fetch('http://52.79.53.159:3000/api/users/login', {
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

    const result = await response.json();
    console.log('서버 응답:', result);

    if (response.ok) {
      console.log('User authenticated successfully:', result);
      // 로그인 성공 후 필요한 정보(예: JWT 토큰) 저장
      Cookies.set('auth', 'true', { expires: 7 });
      return { success: true };
    } else {
      console.error('Failed to authenticate user');
      return { success: false, message: result.message || '로그인에 실패했습니다. 다시 시도해주세요.' };
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    return { success: false, message: '서버와의 통신 중 오류가 발생했습니다.' };
  }
};



export const logout = () => {
  try {
    // 쿠키 제거
    Cookies.remove('auth');
    // 로컬 스토리지 클리어 (필요한 경우)
    localStorage.clear();
    // 세션 스토리지 클리어 (필요한 경우)
    sessionStorage.clear();
    
    // 로그인 페이지로 리다이렉트
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
  }
};