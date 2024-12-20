// src/components/dashboard/DashboardHeader.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from '../common/ThemeToggle';
import { Menu } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { useTheme } from 'next-themes';

export default function DashboardHeader() {
 const { isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed } = useDashboard();
 const { theme } = useTheme();
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
   setMounted(true);
 }, []);

 if (!mounted) return null;

 return (
   <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
     <div className="flex h-16 items-center justify-between px-4 md:px-6">
       {/* 좌측: 메뉴 버튼 */}
       <div className="flex items-center gap-4">
         <button
           onClick={() => {
             setIsMobileOpen(!isMobileOpen);
             setIsCollapsed(!isCollapsed);
           }}
           className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
           aria-label="Toggle Menu"
         >
           <Menu className="h-6 w-6" />
         </button>
       </div>

       {/* 중앙: 로고 */}
       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:left-auto md:top-auto md:translate-x-0 md:translate-y-0 md:pl-4">
         <Link 
           href="/dashboard" 
           className="group block focus:outline-none"
           aria-label="Go to Dashboard"
         >
           <Image
             src={theme === 'dark' ? '/images/logo-dark-with-text.svg' : '/images/logo-light-with-text.svg'}
             alt="Emergency Analysis Logo"
             width={180}
             height={40}
             className="h-8 w-auto transition-opacity group-hover:opacity-80"
             priority
           />
         </Link>
       </div>

       {/* 우측: 테마 토글 */}
       <div className="flex items-center">
         <ThemeToggle 
           className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700" 
         />
       </div>
     </div>
   </header>
 );
}