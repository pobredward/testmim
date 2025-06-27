export interface Comment {
  id: string;
  testCode: string;
  content: string;
  authorId: string | null; // null이면 익명
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  dislikes: number;
  likedBy: string[]; // 좋아요를 누른 사용자 ID 배열
  dislikedBy: string[]; // 싫어요를 누른 사용자 ID 배열
  parentId: string | null; // 대댓글인 경우 부모 댓글 ID
  replies?: Comment[]; // 대댓글 배열 (UI에서 사용)
  isDeleted: boolean;
  isReported: boolean;
  reportCount: number;
}

export interface CommentInput {
  testCode: string;
  content: string;
  authorId: string | null;
  authorName: string;
  parentId?: string | null;
}

export interface CommentVote {
  commentId: string;
  userId: string;
  type: 'like' | 'dislike';
}

export interface CommentReport {
  commentId: string;
  reporterId: string;
  reason: string;
  createdAt: Date;
} 