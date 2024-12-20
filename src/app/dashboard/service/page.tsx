'use client';
import React, { useState, useEffect } from 'react';
import { getAuthToken } from '@/lib/utils/auth';
import {
  FaEdit,
  FaTrashAlt,
  FaPlusCircle,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa';
import emailjs from 'emailjs-com';
import { useAuth } from '@/context/AuthContext';

interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const { user } = useAuth();

  const fetchNotices = async () => {
    const token = getAuthToken();
    if (!token) {
      alert('Access Token이 필요합니다. 다시 로그인해주세요.');
      return;
    }

    try {
      const response = await fetch('https://www.hwouu.shop/api/notices', {
        headers: {
          Authorization: `Bearer ${token}`,
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
      console.error(err);
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
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        throw new Error('공지사항 작성/수정에 실패했습니다.');
      }

      setNewNotice({ title: '', content: '' });
      setEditingNotice(null);
      setIsCreating(false);
      fetchNotices();
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    const token = getAuthToken();
    if (!token) {
      alert('인증 토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      const response = await fetch(`https://www.hwouu.shop/api/notices/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('공지사항 삭제에 실패했습니다.');
      }

      fetchNotices();
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setNewNotice({ title: notice.title, content: notice.content });
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">공지사항</h2>
        {user?.isMaster && !isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <FaPlusCircle className="h-4 w-4" />새 공지사항
          </button>
        )}
      </div>

      {isCreating && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {editingNotice ? '공지사항 수정' : '새 공지사항'}
          </h3>
          <input
            type="text"
            className="mb-4 w-full rounded-lg border border-gray-300 p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="제목을 입력하세요"
            value={newNotice.title}
            onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
          />
          <textarea
            className="mb-4 w-full rounded-lg border border-gray-300 p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            rows={4}
            placeholder="내용을 입력하세요"
            value={newNotice.content}
            onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateOrUpdate}
              className="flex items-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {editingNotice ? '수정하기' : '작성하기'}
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingNotice(null);
                setNewNotice({ title: '', content: '' });
              }}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {notice.title}
                  </h3>
                  <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                    {notice.content}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      작성일:{' '}
                      {new Date(notice.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {notice.updatedAt !== notice.createdAt && (
                      <>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <span>
                          수정일:{' '}
                          {new Date(notice.updatedAt).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {user?.isMaster && (
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => handleEdit(notice)}
                      className="flex items-center rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                    >
                      <FaEdit className="mr-1.5 h-4 w-4" />
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(notice.id)}
                      className="flex items-center rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    >
                      <FaTrashAlt className="mr-1.5 h-4 w-4" />
                      삭제
                    </button>
                  </div>
                )}
              </div>

              <div className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 bg-gray-200 transition-transform group-hover:scale-x-100 dark:bg-gray-700" />
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
      reply_to: userEmail,
      message,
      date: new Date().toLocaleString(),
    };

    try {
      await emailjs.send(serviceId || '', templateId || '', templateParams, publicKey);
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1:1 문의</h2>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <input
          type="email"
          className="mb-4 w-full rounded-lg border border-gray-300 p-3 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="답장을 받을 이메일 주소를 입력하세요"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <textarea
          className="mb-4 w-full rounded-lg border border-gray-300 p-3 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          rows={4}
          placeholder="문의 내용을 입력하세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            loading
              ? 'cursor-not-allowed bg-gray-400 text-gray-700'
              : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
              전송 중...
            </>
          ) : (
            <>
              <FaPaperPlane className="h-4 w-4" />
              문의하기
            </>
          )}
        </button>

        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <FaCheckCircle className="h-5 w-5" />
            {success}
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <FaExclamationCircle className="h-5 w-5" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
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
            Authorization: `Bearer ${token}`,
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">자주 묻는 질문</h2>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <FaExclamationCircle className="mb-2 h-5 w-5" />
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <summary className="flex cursor-pointer items-center justify-between p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                <div className="ml-4 transition-transform group-open:rotate-180">
                  <svg
                    className="h-5 w-5 text-gray-500 dark:text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </summary>
              <div className="border-t border-gray-200 p-6 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  마지막 업데이트: {new Date(faq.updatedAt).toLocaleDateString('ko-KR')}
                </div>
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
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">고객지원</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          공지사항 확인 및 1:1 문의를 이용하실 수 있습니다.
        </p>
      </div>

      <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'notice', label: '공지사항' },
          { id: 'inquiry', label: '1:1 문의' },
          { id: 'faq', label: '자주 묻는 질문' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {activeTab === 'notice' && <NoticeBoard />}
        {activeTab === 'inquiry' && <OneToOneInquiry />}
        {activeTab === 'faq' && <FAQ />}
      </div>
    </div>
  );
}
