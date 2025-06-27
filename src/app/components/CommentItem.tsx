"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Comment } from '@/types/comments';
import { 
  voteComment, 
  removeVote, 
  createComment, 
  deleteComment, 
  reportComment 
} from '@/utils/comments';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: Comment;
  testCode: string;
  isReply?: boolean;
}

export default function CommentItem({ comment, testCode, isReply = false }: CommentItemProps) {
  const { data: session } = useSession();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [voting, setVoting] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  const userId = session?.user?.id;
  const isAuthor = userId === comment.authorId;
  const hasLiked = userId ? comment.likedBy.includes(userId) : false;
  const hasDisliked = userId ? comment.dislikedBy.includes(userId) : false;

  // 시간 포맷팅
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}일 전`;
    
    return date.toLocaleDateString('ko-KR');
  };

  // 좋아요/싫어요 처리
  const handleVote = async (type: 'like' | 'dislike') => {
    if (!userId || voting) return;

    setVoting(true);
    try {
      const currentVote = hasLiked ? 'like' : hasDisliked ? 'dislike' : null;
      
      if (currentVote === type) {
        // 같은 투표 취소
        await removeVote(comment.id, userId);
      } else {
        // 새로운 투표 또는 반대 투표
        await voteComment(comment.id, userId, type);
      }
    } catch (error) {
      console.error('투표 오류:', error);
      alert('투표 중 오류가 발생했습니다.');
    } finally {
      setVoting(false);
    }
  };

  // 대댓글 작성
  const handleReplySubmit = async (content: string) => {
    if (!userId || !content.trim()) return;

    const authorName = session?.user?.nickname || 
                     session?.user?.name || 
                     `익명${Math.floor(Math.random() * 1000)}`;

    setSubmitting(true);
    try {
      await createComment({
        testCode,
        content: content.trim(),
        authorId: userId,
        authorName,
        parentId: comment.id,
      });
      setShowReplyForm(false);
    } catch (error) {
      console.error('대댓글 작성 오류:', error);
      alert('대댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 댓글 삭제
  const handleDelete = async () => {
    if (!userId || !isAuthor) return;
    
    const confirmed = confirm('정말 이 댓글을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await deleteComment(comment.id, userId);
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  // 댓글 신고
  const handleReport = async (reason: string) => {
    if (!userId || !reason.trim()) return;

    try {
      await reportComment(comment.id, userId, reason);
      setShowReportForm(false);
      alert('신고가 접수되었습니다.');
    } catch (error) {
      console.error('댓글 신고 오류:', error);
      alert('신고 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={`${isReply ? 'ml-8 pl-4 border-l-2 border-gray-200' : ''}`}>
      <div className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow">
        {/* 댓글 헤더 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {comment.authorName[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div className="font-medium text-gray-900 text-sm">
                {comment.authorName}
                {comment.authorId === null && (
                  <span className="ml-1 text-xs text-gray-500">(익명)</span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(comment.createdAt)}
                {comment.updatedAt && (
                  <span className="ml-1">(수정됨)</span>
                )}
              </div>
            </div>
          </div>

          {/* 댓글 메뉴 */}
          <div className="flex items-center space-x-2">
            {isAuthor && (
              <button
                onClick={handleDelete}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                삭제
              </button>
            )}
            {!isAuthor && userId && (
              <button
                onClick={() => setShowReportForm(!showReportForm)}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                신고
              </button>
            )}
          </div>
        </div>

        {/* 댓글 내용 */}
        <div className="mb-3">
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>

        {/* 댓글 액션 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* 좋아요/싫어요 버튼 */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleVote('like')}
                disabled={!userId || voting}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                  hasLiked 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                } ${!userId ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <span>👍</span>
                <span>{comment.likes}</span>
              </button>
              
              <button
                onClick={() => handleVote('dislike')}
                disabled={!userId || voting}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                  hasDisliked 
                    ? 'bg-red-100 text-red-600' 
                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                } ${!userId ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <span>👎</span>
                <span>{comment.dislikes}</span>
              </button>
            </div>

            {/* 답글 버튼 */}
            {!isReply && userId && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                💬 답글
              </button>
            )}
          </div>
        </div>

        {/* 신고 폼 */}
        {showReportForm && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800 mb-2">댓글 신고</h4>
            <div className="space-y-2">
              {['스팸', '욕설/비방', '부적절한 내용', '기타'].map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleReport(reason)}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowReportForm(false)}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700"
            >
              취소
            </button>
          </div>
        )}

        {/* 답글 작성 폼 */}
        {showReplyForm && (
          <div className="mt-4">
            <CommentForm
              onSubmit={handleReplySubmit}
              submitting={submitting}
              placeholder={`${comment.authorName}님에게 답글 작성...`}
              buttonText="답글 작성"
              onCancel={() => setShowReplyForm(false)}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* 대댓글 목록 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              testCode={testCode}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
} 