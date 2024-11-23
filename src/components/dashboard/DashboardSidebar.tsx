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
  ChevronRight
} from 'lucide-react';
import { logout } from '@/lib/auth/auth';

export default function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
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
      // 로그아웃 확인 다이얼로그 표시
      if (window.confirm('로그아웃 하시겠습니까?')) {
        logout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <aside
      className={`relative flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4 dark:text-white">
        {isCollapsed ? (
          <span className="text-xl font-bold">TAS</span>
        ) : (
          <span className="text-xl font-bold">교통사고분석시스템</span>
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
              className={`flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <LogOut className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : ''}`} />
          {!isCollapsed && <span>로그아웃</span>}
        </button>
      </div>
    </aside>
  );
}