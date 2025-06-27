"use client";

import { useState } from 'react';
import type { Comment } from '@/types/comments';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  testCode: string;
}

export default function CommentList({ comments, testCode }: CommentListProps) {
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  // 댓글 정렬
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'popular') {
      // 좋아요 수 기준으로 정렬
      const aScore = a.likes - a.dislikes;
      const bScore = b.likes - b.dislikes;
      if (aScore !== bScore) return bScore - aScore;
    }
    // 최신순 기본 정렬
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  if (comments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 정렬 옵션 */}
      <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-700">정렬:</span>
        <div className="flex space-x-2">
          <button
            onClick={() => setSortBy('latest')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              sortBy === 'latest'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              sortBy === 'popular'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            인기순
          </button>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {sortedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            testCode={testCode}
          />
        ))}
      </div>
    </div>
  );
} 