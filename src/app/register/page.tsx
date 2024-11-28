"use client"; 
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/auth/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    email: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

     // 회원가입 시도
     const { success, message } = await registerUser(formData);

     if (success) {
       router.push('/login'); // 회원가입 성공 시 로그인 페이지로 이동
     } else {
       setError(message || '회원가입에 실패했습니다. 다시 시도해주세요.');
     }
  };

  return (
    <div className="space-y-8">

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          회원가입
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          아래 양식을 작성하여 회원가입을 진행해주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            아이디
          </label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="아이디"
            required
            className="w-full rounded-lg border px-4 py-2 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            비밀번호
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호"
            required
            className="w-full rounded-lg border px-4 py-2 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            이메일
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일"
            required
            className="w-full rounded-lg border px-4 py-2 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <button type="submit" className="w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          회원가입
        </button>
      </form>
      <button
        onClick={() => router.push('/login')}
        className="w-full rounded-lg bg-gray-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 mt-4"
      >
        로그인 페이지로 돌아가기
      </button>
    </div>
  );
}
