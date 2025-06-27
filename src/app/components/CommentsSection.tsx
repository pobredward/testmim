"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import type { Comment } from '@/types/comments';
import { subscribeToComments, createComment } from '@/utils/comments';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

interface CommentsSectionProps {
  testCode: string;
}

export default function CommentsSection({ testCode }: CommentsSectionProps) {
  const { data: session } = useSession();
  const { t, ready } = useTranslation();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 댓글 실시간 구독
  useEffect(() => {
    const unsubscribe = subscribeToComments(testCode, (newComments) => {
      setComments(newComments);
      setLoading(false);
    });

    return unsubscribe;
  }, [testCode]);

  // 새 댓글 작성
  const handleSubmitComment = async (content: string) => {
    if (!content.trim()) return;

    const authorName = session?.user?.nickname || 
                     session?.user?.name || 
                     `익명${Math.floor(Math.random() * 1000)}`;

    setSubmitting(true);
    try {
      await createComment({
        testCode,
        content: content.trim(),
        authorId: session?.user?.id || null,
        authorName,
        parentId: null,
      });
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      alert(t('comments.errors.createError'));
    } finally {
      setSubmitting(false);
    }
  };

  const totalComments = comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0);

  // i18n이 준비되지 않았으면 로딩 표시
  if (!ready) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 px-4">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 px-4">
      {/* 댓글 헤더 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {t('comments.title', { count: totalComments })}
        </h2>

      </div>

      {/* 댓글 작성 폼 */}
      <div className="mb-8">
        <CommentForm 
          onSubmit={handleSubmitComment}
          submitting={submitting}
          placeholder={t('comments.form.placeholder')}
        />
      </div>

      {/* 댓글 목록 */}
      <div>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">💭</div>
            <p className="text-gray-500 mb-2">{t('comments.noComments')}</p>
            <p className="text-sm text-gray-400">{t('comments.firstComment')}</p>
          </div>
        ) : (
          <CommentList 
            comments={comments} 
            testCode={testCode}
          />
        )}
      </div>
    </div>
  );
} 