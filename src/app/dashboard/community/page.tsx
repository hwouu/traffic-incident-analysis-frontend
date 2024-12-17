'use client';
import React, { useState, useEffect } from 'react';
import { getAuthToken } from '@/lib/utils/auth';

interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
        }

        const response = await fetch('https://www.hwouu.shop/api/notices', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('공지사항을 불러오는 데 실패했습니다.');
        }

        const data: Notice[] = await response.json();
        setNotices(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <div className="p-4">
      <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">공지사항 게시판</h2>

      {loading && <p className="text-gray-600 dark:text-gray-300">불러오는 중...</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {/* 공지사항 목록 */}
      {!loading && !error && (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                {notice.title}
              </h3>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{notice.content}</p>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                작성일: {new Date(notice.createdAt).toLocaleString()} | 수정일:{' '}
                {new Date(notice.updatedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
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

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

function FAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
        }

        const response = await fetch('https://www.hwouu.shop/api/faqs', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('FAQ를 불러오는 데 실패했습니다.');
        }

        const data: FAQItem[] = await response.json();
        setFaqs(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  return (
    <div className="p-4">
      <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">FAQ</h2>

      {loading && <p className="text-gray-600 dark:text-gray-300">불러오는 중...</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {/* FAQ 목록 */}
      {!loading && !error && (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <summary className="cursor-pointer text-md font-semibold text-gray-900 dark:text-white">
                {faq.question}
              </summary>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{faq.answer}</p>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                작성일: {new Date(faq.createdAt).toLocaleString()} | 수정일:{' '}
                {new Date(faq.updatedAt).toLocaleString()}
              </div>
            </details>
          ))}
        </div>
      )}
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
