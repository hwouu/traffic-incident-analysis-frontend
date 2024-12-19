const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.hwouu.shop';

export const fetchAllUsers = async () => {
  try {
    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Access Token이 필요합니다.');
    }

    const response = await fetch(`${API_BASE_URL}/api/users/all-users`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // Authorization 헤더 추가
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '사용자 목록을 불러오는데 실패했습니다.');
    }

    return data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const deleteUser = async (userId: number) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Access Token이 필요합니다.');
    }

    const response = await fetch(`${API_BASE_URL}/api/users/delete-user/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data.message;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};