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
  const { t } = useTranslation();
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
      alert('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalComments = comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 px-4">
      {/* 댓글 헤더 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          댓글 {totalComments}개
        </h2>

      </div>

      {/* 댓글 작성 폼 */}
      <div className="mb-8">
        <CommentForm 
          onSubmit={handleSubmitComment}
          submitting={submitting}
          placeholder="이 테스트에 대한 생각을 남겨주세요..."
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
            <p className="text-gray-500 mb-2">아직 댓글이 없어요</p>
            <p className="text-sm text-gray-400">첫 번째 댓글을 남겨보세요!</p>
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