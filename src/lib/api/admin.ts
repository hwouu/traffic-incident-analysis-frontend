// src/lib/api/admin.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.hwouu.shop';

export const fetchAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/all-users`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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