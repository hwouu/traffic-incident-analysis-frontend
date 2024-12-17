// src/components/dashboard/DashboardHeader.tsx
'use client';

import { useState, useEffect } from 'react';
import ThemeToggle from '../common/ThemeToggle';
import { Menu, Search } from 'lucide-react';
import Logo from '../common/Logo';
import { useDashboard } from '@/context/DashboardContext';

export default function DashboardHeader() {
 const { isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed } = useDashboard();
 const [mounted, setMounted] = useState(false);
 const [isSearchVisible, setIsSearchVisible] = useState(false);

 useEffect(() => {
   setMounted(true);
 }, []);

 if (!mounted) return null;

 return (
   <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
     <div className="flex h-16 items-center px-4 md:px-6">
       <div className="flex w-full items-center justify-between">
         {/* 로고 및 메뉴 버튼 */}
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
           <Logo 
             variant="icon-only" 
             size="sm" 
             className="hidden md:block" 
             withLink={false} 
           />
         </div>

         {/* 보고서 검색 박스 - 모바일에서는 토글 버튼으로 표시 */}
         <div className="flex flex-1 justify-center px-4">
           <div className={`relative w-full max-w-[800px] transition-all duration-300 ${
             isSearchVisible ? 'opacity-100' : 'hidden md:block md:opacity-100'
           }`}>
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
               <Search className="h-5 w-5 text-gray-400" />
             </div>
             <input
               type="search"
               className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
               placeholder="보고서 검색..."
             />
           </div>
           
           {/* 모바일 검색 토글 버튼 */}
           <button
             className="md:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
             onClick={() => setIsSearchVisible(!isSearchVisible)}
             aria-label="Toggle Search"
           >
             <Search className="h-6 w-6" />
           </button>
         </div>

         {/* 테마 토글 */}
         <div className="flex items-center">
           <ThemeToggle 
             className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700" 
           />
         </div>
       </div>
     </div>

     {/* 모바일 검색바 - 토글 시 표시 */}
     {isSearchVisible && (
       <div className="border-t border-gray-200 p-4 md:hidden dark:border-gray-700">
         <div className="relative">
           <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
             <Search className="h-5 w-5 text-gray-400" />
           </div>
           <input
             type="search"
             className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
             placeholder="보고서 검색..."
           />
         </div>
       </div>
     )}
   </header>
 );
}