'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { authenticateUser } from '@/lib/auth/auth';
import Cookies from 'js-cookie';

interface FormErrors {
  id: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    email: ''
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({
    id: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    id: false,
    password: false,
  });

  const validateField = (name: string, value: string) => {
    if (!value && touched[name as keyof typeof touched]) {
      return name === 'id' ? '아이디를 입력해주세요' : '비밀번호를 입력해주세요';
    }
    return '';
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    const error = validateField(name, formData[name as keyof typeof formData]);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setFormErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    // 모든 필드를 touched로 설정
    setTouched({ id: true, password: true });
  
    // 유효성 검사
    const errors = {
      id: validateField('id', formData.id),
      password: validateField('password', formData.password)
    };
  
    setFormErrors(errors);
  
    // 에러가 있으면 제출하지 않음
    if (errors.id || errors.password) {
      return;
    }
  
    try {
      const { success, message } = await authenticateUser(formData);
  
      if (success) {
        router.push('/dashboard');
      } else {
        if (message?.includes('Cannot read properties of null')) {
          setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        } else if (message?.includes('서버에 연결할 수 없습니다')) {
          setError('서버와의 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.');
        } else {
          setError(message || '로그인에 실패했습니다. 다시 시도해주세요.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          로그인
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          교통사고 분석 시스템에 오신 것을 환영합니다
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-900 dark:text-gray-300">
              아이디
            </label>
            <input
              id="id"
              name="id"
              type="text"
              value={formData.id}
              onChange={handleChange}
              onBlur={() => handleBlur('id')}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="아이디를 입력하세요"
            />
            {formErrors.id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.id}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-300">
              비밀번호
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="비밀번호를 입력하세요"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transform"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.password}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          로그인
        </button>
      </form>

      {/* 회원가입 링크 */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          계정이 없으신가요?{' '}
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}