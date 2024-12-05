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
        className={`fixed left-0 top-0 z-40 h-screen w-[280px] transform border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 md:sticky ${
          isCollapsed ? 'md:w-28' : 'md:w-68'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Toggle Button - Desktop Only */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 hidden h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 md:flex"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>

        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6 dark:border-gray-700">
          {isCollapsed ? (
            <span className="text-2xl font-bold text-gray-900 dark:text-white">TAS</span>
          ) : (
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              교통사고 분석 시스템
            </span>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center space-x-2 rounded-lg px-5 py-4 transition-colors ${
                  isActive
                    ? 'bg-primary text-xl font-bold text-white'
                    : 'font-bold text-xl text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className={`h-8 w-8 ${isCollapsed ? 'mx-auto' : ''}`} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-gray-200 px-4 py-6 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg px-5 py-4 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <LogOut className={`h-8 w-8 ${isCollapsed ? 'mx-auto' : ''}`} />
            {!isCollapsed && <span className="ml-4 text-xl">로그아웃</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
