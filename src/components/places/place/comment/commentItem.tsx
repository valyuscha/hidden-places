'use client';

import { useState } from 'react';
import { useVoteComment, useReplies } from '@/hooks/useComment';
import { useCurrentUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { CommentForm } from './commentForm';
import { CommentItemProps, Comment } from './types';
import s from './styles.module.scss';

const REPLIES_TAKE = 5;

export const CommentItem = ({ comment, placeId, onUpdate }: CommentItemProps) => {
  const { currentUser } = useCurrentUser();
  const { voteComment } = useVoteComment();
  const router = useRouter();

  const [ localComment, setLocalComment ] = useState<Comment>({ ...comment });
  const [ visibleCount, setVisibleCount ] = useState(REPLIES_TAKE);
  const [ localReplies, setLocalReplies ] = useState<Comment[]>([]);
  const [ showReplyForm, setShowReplyForm ] = useState(false);

  const {
    loadMore,
    replies: fetchedReplies,
    totalCount,
    loading,
  } = useReplies(+comment.id, +currentUser?.id);

  const mergedRepliesMap = new Map<number, Comment>();
  [...localReplies, ...fetchedReplies].forEach((reply) => {
    mergedRepliesMap.set(reply.id, reply);
  });
  const mergedReplies = Array.from(mergedRepliesMap.values());
  const visibleReplies = mergedReplies.slice(0, visibleCount);
  const canLoadMore = mergedReplies.length < totalCount || visibleCount < mergedReplies.length;

  const handleLoadMore = async () => {
    await loadMore();
    setVisibleCount((prev) => prev + REPLIES_TAKE);
  };

  const handleAddReply = (newReply: Comment) => {
    setLocalReplies((prev) => {
      const exists = prev.some((r) => r.id === newReply.id);
      return exists ? prev : [newReply, ...prev];
    });

    setVisibleCount(REPLIES_TAKE);
    setShowReplyForm(false);
  };

  const handleVote = async (isLike: boolean) => {
    if (!currentUser) {
      router.push('/auth');
      return;
    }

    const updated = await voteComment(+currentUser.id, +comment.id, isLike);
    if (!updated) return;

    setLocalComment((prev) => ({
      ...prev,
      likes: updated.likes,
      dislikes: updated.dislikes,
      hasUserLiked: updated.hasUserLiked,
      hasUserDisliked: updated.hasUserDisliked,
    }));
  };

  return (
    <div className={s.comment}>
      <p className={s.meta}>{localComment.user.name}</p>
      <p className={s.text}>{localComment.text}</p>
      <div className={s.actions}>
        <button
          className={localComment.hasUserLiked ? s.voted : ''}
          disabled={localComment.hasUserLiked}
          onClick={() => handleVote(true)}
        >
          <FaThumbsUp /> {localComment.likes}
        </button>
        <button
          className={localComment.hasUserDisliked ? s.voted : ''}
          disabled={localComment.hasUserDisliked}
          onClick={() => handleVote(false)}
        >
          <FaThumbsDown /> {localComment.dislikes}
        </button>
        <button
          className={s.replyBtn}
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          {showReplyForm ? 'Cancel' : 'Reply'}
        </button>
      </div>
      {showReplyForm && (
        <div className={s.replyForm}>
          <CommentForm
            placeId={+placeId}
            parentCommentId={+comment.id}
            onSuccess={onUpdate}
            submitText="Reply"
            onAddReply={handleAddReply}
          />
        </div>
      )}
      <div className={s.replies}>
        {visibleReplies.map((reply) => (
          <div key={reply.id} className={s.reply}>
            <p className={s.meta}>{reply.user?.name}</p>
            <p className={s.text}>{reply.text}</p>
          </div>
        ))}
        {canLoadMore && (
          <button className={s.loadMoreBtn} onClick={handleLoadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load more replies'}
          </button>
        )}
      </div>
    </div>
  );
};
