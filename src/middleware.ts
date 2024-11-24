import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 현재 URL과 환경 확인
  const { pathname, origin } = request.nextUrl;
  console.log('Current pathname:', pathname);
  console.log('Current origin:', origin);

  // 모든 쿠키 로깅
  const cookies = request.cookies.getAll();
  console.log('All cookies:', cookies);

  // 인증 상태 확인 (여러 쿠키 확인)
  const isAuthenticated = request.cookies.has('auth') || 
                         request.cookies.has('authToken') || 
                         request.cookies.has('token');
  
  console.log('Authentication status:', isAuthenticated);

  // 보호된 라우트에 대한 접근 제어
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      console.log('Unauthorized access attempt to dashboard, redirecting to login');
      return NextResponse.redirect(new URL('/login', origin));
    }
  }

  // 로그인한 사용자의 로그인/회원가입 페이지 접근 제어
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (isAuthenticated) {
      console.log('Authenticated user attempting to access login/register, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', origin));
    }
  }

  // 응답 헤더 설정
  const response = NextResponse.next();
  
  // 보안 헤더 추가
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

// 미들웨어 matcher 설정 수정
export const config = {
  matcher: [
    // 대시보드 관련 모든 경로
    '/dashboard',
    '/dashboard/:path*',
    // 인증 관련 경로
    '/login',
    '/register'
  ]
};