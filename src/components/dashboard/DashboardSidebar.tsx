'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  MessageSquareText,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { logout } from '@/lib/auth/auth';
import { useDashboard } from '@/context/DashboardContext';

export default function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isMobileOpen, setIsMobileOpen } = useDashboard();
  const pathname = usePathname();

  const menuItems = [
    {
      name: '대시보드',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      name: '사고 신고',
      icon: MessageSquareText,
      path: '/dashboard/analysis/chat',
    },
    {
      name: '분석',
      icon: BarChart3,
      path: '/dashboard/analysis',
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
  ];

  const handleLogout = async () => {
    try {
      if (window.confirm('로그아웃 하시겠습니까?')) {
        logout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-[280px] transform border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 md:relative md:top-0 md:h-screen ${
          isCollapsed ? 'md:w-20' : 'md:w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Toggle Button - Desktop Only */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 hidden h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 md:flex"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Logo */}
        <div className="flex h-14 items-center justify-center border-b border-gray-200 px-4 dark:border-gray-700">
          {isCollapsed ? (
            <span className="text-xl font-bold text-gray-900 dark:text-white">TAS</span>
          ) : (
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              교통사고 분석 시스템
            </span>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? 'bg-primary font-bold text-white'
                    : 'text-gray-700 font-bold hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : ''}`} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-gray-200 px-2 py-4 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <LogOut className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : ''}`} />
            {!isCollapsed && <span className="ml-2">로그아웃</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
