// src/components/admin/UserManagement.tsx
'use client';

import { useEffect, useState } from 'react';
import { Loader2, Search, Trash2, AlertCircle, UserCog } from 'lucide-react';
import { fetchAllUsers, deleteUser } from '@/lib/api/admin';
import type { User } from '@/types/admin';
import { Toaster, toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

export default function UserManagement() {
 const [users, setUsers] = useState<User[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [searchTerm, setSearchTerm] = useState('');
 const [userToDelete, setUserToDelete] = useState<User | null>(null);
 const { user: currentUser } = useAuth();

 useEffect(() => {
   const loadUsers = async () => {
     try {
       setIsLoading(true);
       const data = await fetchAllUsers();
       setUsers(data);
     } catch (err) {
       setError(err instanceof Error ? err.message : '사용자 목록을 불러오는데 실패했습니다.');
     } finally {
       setIsLoading(false);
     }
   };

   loadUsers();
 }, []);

 // 삭제 처리 함수
 const handleDelete = async (user: User) => {
   try {
     // 자신을 삭제하려는 경우 방지
     if (user.userID === currentUser?.id) {
       toast.error('자기 자신을 삭제할 수 없습니다.');
       return;
     }

     // 마스터 계정 삭제 방지
     if (user.isMaster) {
       toast.error('마스터 계정은 삭제할 수 없습니다.');
       return;
     }

     const message = await deleteUser(user.userID);
     toast.success(message);
     
     // 사용자 목록 새로고침
     const updatedUsers = await fetchAllUsers();
     setUsers(updatedUsers);
     
   } catch (error) {
     toast.error(error instanceof Error ? error.message : '사용자 삭제에 실패했습니다.');
   }
 };

 // 검색 필터링
 const filteredUsers = users.filter((user) => {
   const searchLower = searchTerm.toLowerCase();
   return (
     user.username.toLowerCase().includes(searchLower) ||
     user.email.toLowerCase().includes(searchLower)
   );
 });

 if (isLoading) {
   return (
     <div className="flex h-96 items-center justify-center">
       <Loader2 className="h-8 w-8 animate-spin text-primary" />
     </div>
   );
 }

 if (error) {
   return (
     <div className="flex h-96 items-center justify-center">
       <div className="text-red-500">{error}</div>
     </div>
   );
 }

 return (
   <div className="container mx-auto space-y-6 p-6">
     <div className="flex items-center justify-between">
       <div>
         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">사용자 관리</h1>
         <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
           시스템에 등록된 사용자들을 관리할 수 있습니다.
         </p>
       </div>
     </div>

     {/* 검색 및 필터 영역 */}
     <div className="space-y-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
       <div className="relative">
         <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
         <input
           type="text"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           placeholder="사용자 검색..."
           className="w-full rounded-lg border border-gray-300 bg-transparent py-2 pl-10 pr-4 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:text-gray-100"
         />
       </div>
     </div>

     {/* 사용자 목록 테이블 */}
     <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
       <div className="overflow-x-auto">
         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
           <thead className="bg-gray-50 dark:bg-gray-900">
             <tr>
               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                 ID
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                 사용자명
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                 이메일
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                 가입일
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                 상태
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                 권한
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                 작업
               </th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
             {filteredUsers.map((user) => (
               <tr key={user.userID} className="group hover:bg-gray-50 dark:hover:bg-gray-700">
                 <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                   #{user.userID}
                 </td>
                 <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                   {user.username}
                 </td>
                 <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                   {user.email}
                 </td>
                 <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                   {format(new Date(user.createdAt), 'yyyy.MM.dd')}
                 </td>
                 <td className="whitespace-nowrap px-6 py-4 text-sm">
                   <span
                     className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                       user.emailVerified
                         ? 'bg-green-100 text-green-800'
                         : 'bg-red-100 text-red-800'
                     }`}
                   >
                     {user.emailVerified ? '인증됨' : '미인증'}
                   </span>
                 </td>
                 <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                   {user.isMaster ? (
                     <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 text-xs font-semibold leading-5 text-purple-800">
                       <UserCog className="h-4 w-4" />
                       관리자
                     </span>
                   ) : (
                     <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                       일반 사용자
                     </span>
                   )}
                 </td>
                 <td className="whitespace-nowrap px-6 py-4">
                   {!user.isMaster && ( // 마스터 계정이 아닌 경우에만 삭제 버튼 표시
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         setUserToDelete(user);
                       }}
                       className="group-hover:opacity-100 opacity-0 transition-opacity duration-200 text-gray-400 hover:text-red-600"
                     >
                       <Trash2 className="h-5 w-5" />
                     </button>
                   )}
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     </div>

     {/* 삭제 확인 모달 */}
     {userToDelete && (
       <div 
         className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" 
         onClick={() => setUserToDelete(null)}
       >
         <div 
           className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800" 
           onClick={e => e.stopPropagation()}
         >
           <div className="mb-4 flex items-center gap-2 text-red-500">
             <AlertCircle className="h-6 w-6" />
             <h3 className="text-lg font-semibold">사용자 삭제 확인</h3>
           </div>
           <p className="mb-6 text-gray-600 dark:text-gray-400">
             <span className="font-semibold">{userToDelete.username}</span> 사용자를 삭제하시겠습니까?
             <span className="mt-2 block text-sm text-red-500">
               삭제된 사용자의 보고서는 마스터 계정으로 이전되며, 이 작업은 되돌릴 수 없습니다.
             </span>
           </p>
           <div className="flex justify-end gap-4">
             <button
               onClick={() => setUserToDelete(null)}
               className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
             >
               취소
             </button>
             <button
               onClick={() => {
                 handleDelete(userToDelete);
                 setUserToDelete(null);
               }}
               className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
             >
               삭제
             </button>
           </div>
         </div>
       </div>
     )}

     {/* 토스트 알림 */}
     <Toaster position="top-center" />
   </div>
 );
}