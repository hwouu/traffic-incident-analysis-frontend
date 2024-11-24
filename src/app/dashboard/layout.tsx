'use client';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { DashboardProvider } from '@/context/DashboardContext';
import { useState } from 'react';

export default function DashboardLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 // 모바일 메뉴 토글 버튼을 위한 상태
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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