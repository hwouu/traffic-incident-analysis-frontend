'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { DashboardProvider } from '@/context/DashboardContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드에서 auth 쿠키 확인
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const hasAuthCookie = cookies.some(cookie => 
        cookie.trim().startsWith('auth=')
      );

      if (!hasAuthCookie) {
        console.log('No auth cookie found, redirecting to login');
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <DashboardProvider>
      <div className="flex min-h-screen max-w-full bg-gray-100 dark:bg-gray-900">
        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-20 bg-gray-900/50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <DashboardSidebar />
        <div className="flex w-full flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}