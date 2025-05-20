'use client';

import { useState, useEffect } from 'react';
import { useCommentsByPlace } from '@/hooks/useComment';
import { useCurrentUser } from '@/hooks/useUser';
import { CommentForm } from './commentForm';
import { CommentItem } from './commentItem';
import { CommentSectionProps, Comment } from './types';
import s from './styles.module.scss';

const COMMENTS_TAKE = 5;

export const CommentSection = ({ placeId }: CommentSectionProps) => {
  const { currentUser } = useCurrentUser();
  const {
    initialComments,
    fetchMore,
    loading,
    totalCount,
  } = useCommentsByPlace(+placeId, +currentUser?.id, 0, COMMENTS_TAKE);

  const [comments, setComments] = useState<Comment[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (comments.length === 0 && initialComments.length > 0) {
      setComments(initialComments);
      setOffset(initialComments.length);
    }

    if (initialComments.length >= totalCount) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [initialComments, totalCount]);

  const handleLoadMore = async () => {
    const result = await fetchMore({
      variables: {
        skip: offset,
        take: COMMENTS_TAKE,
      },
    });

    const newComments = result.data?.commentsByPlace.comments || [];

    if (newComments.length > 0) {
      setComments((prev) => [...prev, ...newComments]);
      const newOffset = offset + newComments.length;
      setOffset(newOffset);
      if (newOffset >= totalCount) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
  };

  const handleNewComment = (newComment: Comment) => {
    if (!newComment) return;

    const updated = [newComment, ...comments].slice(0, COMMENTS_TAKE);
    setComments(updated);
    setOffset(updated.length);

    setHasMore(updated.length < totalCount);
  };

  return (
    <section className={s.section}>
      <div className={s.container}>
        <h2>Comments</h2>
        <CommentForm
          className={s.form}
          placeId={placeId}
          parentCommentId={undefined}
          onSuccess={handleNewComment}
        />
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            placeId={placeId}
            onUpdate={() => {}}
          />
        ))}
        {hasMore && (
          <button
            className={s.loadMoreBtn}
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load more comments'}
          </button>
        )}
      </div>
    </section>
  );
};
