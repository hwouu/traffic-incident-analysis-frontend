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
  Car,
  Globe,
  Users,
  Settings,
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
      description: '전체 현황 확인',
    },
    {
      name: '사고 분석',
      icon: MessageSquareText,
      path: '/dashboard/analysis/chat',
      description: 'ChatGPT 기반 분석',
    },
    {
      name: '보고서',
      icon: FileText,
      path: '/dashboard/reports',
      description: '분석 보고서 관리',
    },
    {
      name: '통계',
      icon: BarChart3,
      path: '/dashboard/statistics',
      description: '데이터 통계 분석',
    },
    {
      name: '실시간 교통',
      icon: Car,
      path: '/dashboard/traffic',
      description: '실시간 교통 정보',
    },
    {
      name: '사고 현황',
      icon: Globe,
      path: '/dashboard/accident',
      description: '전국 사고 통계',
    },
    {
      name: '커뮤니티',
      icon: Users,
      path: '/dashboard/community',
      description: '사용자 커뮤니티',
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
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen transform border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 md:sticky ${
          isCollapsed ? 'md:w-20' : 'md:w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 hidden h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 md:flex"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200 px-4 dark:border-gray-700">
          {isCollapsed ? (
            <span className="mx-auto text-xl font-bold text-gray-900 dark:text-white">TAS</span>
          ) : (
            <span className="text-lg font-bold text-gray-900 dark:text-white">교통사고 분석 시스템</span>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex h-[calc(100vh-4rem)] flex-col justify-between">
          <nav className="space-y-1 p-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`group flex items-center rounded-lg p-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!isCollapsed && (
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.description}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-lg p-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <LogOut className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span>로그아웃</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}