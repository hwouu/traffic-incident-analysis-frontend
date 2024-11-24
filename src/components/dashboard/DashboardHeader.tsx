'use client';

import { useState, useEffect } from 'react';
import ThemeToggle from '../common/ThemeToggle';
import { Bell, Menu } from 'lucide-react';
import Logo from '../common/Logo';
import { useDashboard } from '@/context/DashboardContext';

export default function DashboardHeader() {
 const [notifications] = useState<Array<any>>([]);
 const { isMobileOpen, setIsMobileOpen } = useDashboard();
 const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

 return (
   <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
     <div className="flex h-14 items-center justify-between px-4 md:px-6">
       {/* 모바일: 메뉴 버튼, 중앙 정렬 로고, 우측 아이콘들 */}
       <div className="relative flex w-full items-center justify-between md:w-auto">
         <button
           onClick={() => setIsMobileOpen(true)}
           className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 md:hidden"
         >
           <Menu className="h-6 w-6" />
         </button>

         {/* 모바일: 중앙 정렬된 로고 */}
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
           <Logo variant="with-text" size="xl" className="text-gray-900 dark:text-white" />
         </div>

         {/* 데스크탑: 왼쪽 정렬된 로고 */}
         <div className="hidden md:block">
           <Logo variant="with-text" size="xl" className="text-gray-900 dark:text-white" />
         </div>

         {/* 모바일: 우측 아이콘들 */}
         <div className="flex items-center space-x-2 md:hidden">
           <ThemeToggle className="relative" />
           <button className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
             <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
             {notifications.length > 0 && (
               <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                 {notifications.length}
               </span>
             )}
           </button>
         </div>
       </div>

       {/* 데스크탑: 우측 아이콘들 */}
       <div className="hidden items-center space-x-4 md:flex">
         <ThemeToggle className="relative" />
         <button className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
           <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
           {notifications.length > 0 && (
             <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
               {notifications.length}
             </span>
           )}
         </button>
       </div>
     </div>
   </header>
 );
}