'use client';

import { useState } from 'react';
import { useCreateComment } from '@/hooks/useComment';
import { useCurrentUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { CommentFormProps } from './types';

export const CommentForm = ({
  placeId,
  parentCommentId = undefined,
  onSuccess,
  onAddReply,
  className,
  submitText = 'Add Comment',
}: CommentFormProps) => {
  const { currentUser } = useCurrentUser();
  const { createComment } = useCreateComment();
  const [ text, setText ] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!currentUser) {
      router.push('/auth');
      return;
    }

    const newComment = await createComment({
      text,
      userId: +currentUser.id,
      placeId: +placeId,
      ...(parentCommentId ? { parentCommentId } : {}),
    });

    setText('');

    if (!newComment) return;

    if (parentCommentId) {
      onAddReply?.(newComment);
    } else {
      onSuccess?.(newComment);
    }
  };

  return (
    <div className={className}>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <button
        onClick={handleSubmit}
        disabled={text.trim() === ''}
      >
        {submitText}
      </button>
    </div>
  );
};
