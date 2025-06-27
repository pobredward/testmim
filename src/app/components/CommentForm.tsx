"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  submitting?: boolean;
  placeholder?: string;
  buttonText?: string;
  onCancel?: () => void;
  autoFocus?: boolean;
}

export default function CommentForm({ 
  onSubmit, 
  submitting = false, 
  placeholder,
  buttonText,
  onCancel,
  autoFocus = false
}: CommentFormProps) {
  const { data: session } = useSession();
  const { t, ready } = useTranslation();
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // 기본값 설정 (i18n 준비 상태 확인)
  const defaultPlaceholder = ready ? (placeholder || t('comments.form.placeholder')) : (placeholder || 'Loading...');
  const defaultButtonText = ready ? (buttonText || t('comments.form.submitButton')) : (buttonText || 'Loading...');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    await onSubmit(content);
    setContent('');
    setIsFocused(false);
  };

  const handleCancel = () => {
    setContent('');
    setIsFocused(false);
    onCancel?.();
  };

  const isLoggedIn = !!session?.user;
  const canSubmit = content.trim().length > 0 && !submitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={isLoggedIn ? defaultPlaceholder : (ready ? t('comments.form.loginRequired') : 'Please log in to comment')}
          disabled={!isLoggedIn || submitting}
          autoFocus={autoFocus}
          rows={isFocused ? 4 : 3}
          maxLength={500}
          className={`
            w-full px-4 py-3 border rounded-lg resize-none transition-all
            ${!isLoggedIn ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${isFocused ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}
            focus:outline-none
          `}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {ready ? t('comments.form.characterCount', { current: content.length, max: 500 }) : `${content.length}/500`}
        </div>
      </div>

      {(isFocused || content) && isLoggedIn && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
              {session?.user?.nickname?.[0] || session?.user?.name?.[0] || '?'}
            </div>
            <span>
              {session?.user?.nickname || session?.user?.name || '익명 사용자'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {onCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                {ready ? t('comments.form.cancel') : 'Cancel'}
              </button>
            )}
            <button
              type="submit"
              disabled={!canSubmit}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg transition-all
                ${canSubmit 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {submitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{ready ? t('comments.form.submitting') : 'Submitting...'}</span>
                </div>
              ) : (
                defaultButtonText
              )}
            </button>
          </div>
        </div>
      )}

      {!isLoggedIn && (
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">{ready ? t('comments.form.loginMessage') : 'Please log in to write comments'}</p>
          <button
            type="button"
            onClick={() => window.location.href = '/signin'}
            className="text-sm text-blue-500 hover:text-blue-700 font-medium"
          >
            {ready ? t('comments.form.loginButton') : 'Sign In'}
          </button>
        </div>
      )}
    </form>
  );
} 