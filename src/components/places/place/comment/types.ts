export interface CommentFormProps {
  placeId: number;
  parentCommentId?: number | undefined;
  onSuccess?: (comment: Comment) => void;
  onAddReply?: (comment: Comment) => void;
  className?: string;
  submitText?: string;
}

export interface CommentSectionProps {
  placeId: number;
}

export interface Comment {
  id: number;
  text: string;
  likes: number;
  dislikes: number;
  user: {
    id: number;
    name: string;
  };
  replies: Comment[];
  hasMoreReplies?: boolean;
  hasUserLiked?: boolean;
  hasUserDisliked?: boolean;
}

export interface CommentItemProps {
  comment: Comment;
  placeId: number;
  onUpdate: () => void;
}
