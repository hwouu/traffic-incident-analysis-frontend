'use client';
import React, { useState, useEffect } from 'react';
import { getAuthToken } from '@/lib/utils/auth';
import emailjs from 'emailjs-com';


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
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const fetchNotices = async () => {
    const token = getAuthToken();
    if (!token) {
        alert('Access Token이 필요합니다. 다시 로그인해주세요.');
        return;
    }

    try {
        const response = await fetch('https://www.hwouu.shop/api/notices', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || '공지사항을 불러오는 데 실패했습니다.');
        }

        const data: Notice[] = await response.json();
        setNotices(data);
    } catch (err) {
        alert((err as Error).message);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateOrUpdate = async () => {
    const token = getAuthToken();
    if (!token) {
      alert('인증 토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }

    const url = editingNotice
      ? `https://www.hwouu.shop/api/notices/${editingNotice.id}`
      : 'https://www.hwouu.shop/api/notices';

    const method = editingNotice ? 'PUT' : 'POST';
    const body = JSON.stringify(newNotice);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || '공지사항 작성/수정에 실패했습니다.');
      }

      setNewNotice({ title: '', content: '' });
      setEditingNotice(null);
      setIsCreating(false);
      fetchNotices();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    const token = getAuthToken();
    if (!token) {
      alert('인증 토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      const response = await fetch(`https://www.hwouu.shop/api/notices/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || '공지사항 삭제에 실패했습니다.');
      }

      fetchNotices();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setNewNotice({ title: notice.title, content: notice.content });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingNotice(null);
    setNewNotice({ title: '', content: '' });
    setIsCreating(false);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">공지사항 게시판</h2>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            공지사항 작성
          </button>
        )}
      </div>

      {isCreating ? (
        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white">
            {editingNotice ? '공지사항 수정' : '공지사항 작성'}
          </h3>
          <input
            type="text"
            className="mt-2 w-full rounded border border-gray-300 p-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="제목을 입력하세요."
            value={newNotice.title}
            onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
          />
          <textarea
            className="mt-2 w-full rounded border border-gray-300 p-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            rows={4}
            placeholder="내용을 입력하세요."
            value={newNotice.content}
            onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
          />
          <div className="mt-2 space-x-2">
            <button
              onClick={handleCreateOrUpdate}
              className="rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              {editingNotice ? '수정하기' : '작성하기'}
            </button>
            <button
              onClick={handleCancel}
              className="rounded bg-gray-400 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div>
          {loading && <p className="text-gray-600 dark:text-gray-300">불러오는 중...</p>}

          {!loading && notices.map((notice) => (
            <div
              key={notice.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                  {notice.title}
                </h3>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(notice)}
                    className="rounded bg-yellow-500 px-3 py-1 text-sm font-semibold text-white hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-800"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(notice.id)}
                    className="rounded bg-red-500 px-3 py-1 text-sm font-semibold text-white hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    삭제
                  </button>
                </div>
              </div>
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
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;


  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const templateParams = {
      reply_to: userEmail, // 사용자 이메일
      message, // 문의 내용
      date: new Date().toLocaleString(),
    };

    try {
      await emailjs.send(
        serviceId || "",    // EmailJS에서 발급받은 서비스 ID
        templateId || "",   // EmailJS에서 발급받은 템플릿 ID
        templateParams,       // 템플릿에 전달할 변수
        publicKey     // EmailJS에서 발급받은 Public Key (User ID)
      );

      setSuccess('메일이 성공적으로 전송되었습니다.');
      setUserEmail('');
      setMessage('');
    } catch (err) {
      setError('메일 전송에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">1:1 문의</h2>
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <input
          type="email"
          className="mt-2 w-full rounded border border-gray-300 p-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="답장을 받을 이메일 주소를 입력하세요."
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <textarea
          className="mt-2 w-full rounded border border-gray-300 p-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          rows={4}
          placeholder="문의 내용을 입력하세요."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-2 rounded px-4 py-2 text-sm font-semibold text-white shadow ${
            loading
              ? 'bg-gray-400'
              : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800'
          }`}
        >
          {loading ? '전송 중...' : '제출하기'}
        </button>
        {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
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
        <h1 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">고객지원</h1>
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
