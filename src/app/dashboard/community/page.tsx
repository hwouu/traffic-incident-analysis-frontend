'use client';
import React, { useState } from 'react';

function NoticeBoard() {
  return (
    <div className="p-4">
      <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">공지사항 게시판</h2>
      {/* 공지사항 목록 */}
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white">[공지] 시스템 점검 안내</h3>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            2024년 12월 20일 00:00 ~ 02:00 동안 시스템 점검이 예정되어 있습니다.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white">[공지] 기능 업데이트 소식</h3>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            새롭게 개선된 채팅 인터페이스와 파일 업로드 기능이 추가되었습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

function OneToOneInquiry() {
  return (
    <div className="p-4">
      <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">1:1 문의</h2>
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          문의하실 내용을 남겨주세요. 담당자가 확인 후 최대한 빠르게 답변 드리겠습니다.
        </p>
        <textarea
          className="mt-2 w-full rounded border border-gray-300 p-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          rows={4}
          placeholder="문의 내용을 입력하세요."
        />
        <button
          className="mt-2 rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          제출하기
        </button>
      </div>
    </div>
  );
}

function FAQ() {
  return (
    <div className="p-4">
      <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">FAQ</h2>
      <div className="space-y-4">
        <details className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <summary className="cursor-pointer text-md font-semibold text-gray-900 dark:text-white">
            Q. 회원가입은 어떻게 하나요?
          </summary>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            상단 메뉴의 회원가입 버튼을 클릭하시고 양식에 맞춰 정보를 입력하시면 됩니다.
          </p>
        </details>
        <details className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <summary className="cursor-pointer text-md font-semibold text-gray-900 dark:text-white">
            Q. 비밀번호를 잊어버렸어요.
          </summary>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            로그인 페이지에서 "비밀번호 찾기" 링크를 통해 비밀번호를 재설정할 수 있습니다.
          </p>
        </details>
      </div>
    </div>
  );
}

export default function Page() {
  const [activeTab, setActiveTab] = useState('notice');

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col p-4 md:p-6">
      {/* 첫 번째 줄: 고객지원 센터 제목 */}
      <div className="mb-2">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">고객지원 센터</h1>
      </div>

      {/* 두 번째 줄: 탭(사이드바) 역할의 버튼들 */}
      <div className="mb-4 border-b border-gray-200 pb-2 dark:border-gray-700">
        <nav className="flex space-x-2">
          <button
            onClick={() => setActiveTab('notice')}
            className={`rounded px-3 py-2 text-sm font-semibold ${
              activeTab === 'notice'
                ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            공지사항 게시판
          </button>
          <button
            onClick={() => setActiveTab('inquiry')}
            className={`rounded px-3 py-2 text-sm font-semibold ${
              activeTab === 'inquiry'
                ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            1:1 문의
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`rounded px-3 py-2 text-sm font-semibold ${
              activeTab === 'faq'
                ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            FAQ
          </button>
        </nav>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {activeTab === 'notice' && <NoticeBoard />}
        {activeTab === 'inquiry' && <OneToOneInquiry />}
        {activeTab === 'faq' && <FAQ />}
      </div>
    </div>
  );
}
