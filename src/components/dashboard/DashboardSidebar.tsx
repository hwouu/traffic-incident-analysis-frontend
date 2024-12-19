// src/components/dashboard/DashboardSidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  FileText,
  MessageSquareText,
  BarChart3,
  LogOut,
  Car,
  Globe,
  Users,
} from 'lucide-react';
import { logout } from '@/lib/auth/auth';
import { useDashboard } from '@/context/DashboardContext';
import { useAuth } from '@/context/AuthContext';

export default function DashboardSidebar() {
  const { isMobileOpen, setIsMobileOpen, isCollapsed } = useDashboard();
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    {
      name: '대시보드',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      name: '사고 분석',
      icon: MessageSquareText,
      path: '/dashboard/analysis/chat',
    },
    {
      name: '보고서',
      icon: FileText,
      path: '/dashboard/reports',
    },
    {
      name: '통계',
      icon: BarChart3,
      path: '/dashboard/statistics',
    },
    {
      name: '실시간 교통',
      icon: Car,
      path: '/dashboard/traffic',
    },
    {
      name: '사고 현황',
      icon: Globe,
      path: '/dashboard/accident',
    },
    {
      name: '고객 지원',
      icon: Users,
      path: '/dashboard/service',
    },
  ];

  const handleLogout = async () => {
    try {
      if (window.confirm('로그아웃 하시겠습니까?')) {
        await logout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 z-50 flex h-[calc(100vh-4rem)] flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 md:sticky ${
          isCollapsed ? 'w-64 md:w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* User Profile Section */}
        {isLoading ? (
          <div
            className={`flex flex-col border-b border-gray-200 dark:border-gray-700 ${
              isCollapsed ? 'p-6 md:items-center md:p-4' : 'items-center p-6'
            }`}
          >
            <div
              className={`animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 ${
                isCollapsed && !isMobile ? 'h-10 w-10' : 'h-20 w-20'
              }`}
            />
            {(!isCollapsed || isMobile) && (
              <div className="mt-4 w-full text-center">
                <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mx-auto mt-2 h-3 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            )}
          </div>
        ) : (
          <div
            className={`flex flex-col border-b border-gray-200 dark:border-gray-700 ${
              isCollapsed ? 'p-6 md:items-center md:p-4' : 'items-center p-6'
            }`}
          >
            <Image
              src="/images/profile/default-avatar.svg"
              alt="Profile"
              width={isCollapsed && !isMobile ? 40 : 80}
              height={isCollapsed && !isMobile ? 40 : 80}
              className="flex-shrink-0"
            />
            {(!isCollapsed || isMobile) && (
              <div className="mt-4 w-full text-center">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  {user?.nickname || '사용자'}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileOpen(false);
              }}
              className={`touch-action-manipulation group mb-1 flex items-center rounded-lg p-3 text-sm font-medium transition-colors ${
                pathname === item.path
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${isCollapsed && !isMobile ? 'mr-3 md:mx-auto' : 'mr-3'}`}
              />
              {(!isCollapsed || isMobile) && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="touch-action-manipulation flex w-full items-center rounded-lg p-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <LogOut
              className={`h-5 w-5 ${isCollapsed && !isMobile ? 'mr-3 md:mx-auto' : 'mr-3'}`}
            />
            {(!isCollapsed || isMobile) && <span>로그아웃</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
