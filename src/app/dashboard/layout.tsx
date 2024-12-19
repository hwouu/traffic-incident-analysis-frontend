// src/app/dashboard/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { DashboardProvider } from '@/context/DashboardContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const hasAuthCookie = cookies.some((cookie) => cookie.trim().startsWith('auth='));

      if (!hasAuthCookie) {
        console.log('No auth cookie found, redirecting to login');
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <DashboardProvider>
      <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
        <DashboardHeader />
        <div className="relative flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 overflow-hidden">
            {/* 자식 컴포넌트 내부에서 스크롤 처리 */}
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}
