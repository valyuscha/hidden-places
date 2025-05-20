import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { Comment } from '@/components/places/place/comment/types';
import {
  GET_COMMENT_QUERY,
  GET_COMMENTS_BY_PLACE_QUERY,
  GET_REPLIES_QUERY,
  CREATE_COMMENT_MUTATION,
  UPDATE_COMMENT_MUTATION,
  REMOVE_COMMENT_MUTATION,
  LIKE_COMMENT_MUTATION,
  DISLIKE_COMMENT_MUTATION,
  VOTE_COMMENT_MUTATION,
} from '@/graphql/comment';

interface CreateCommentInput {
  text: string;
  userId: number;
  placeId: number;
  parentCommentId?: number;
}

export const useComment = (id: number, userId?: number) => {
  const { data, loading, error, refetch } = useQuery(GET_COMMENT_QUERY, {
    variables: { id, userId },
    skip: !id,
  });
  return {
    comment: data?.comment,
    loading,
    error,
    refetch,
  };
};

export const useCommentsByPlace = (placeId: number, userId?: number, skip = 0, take = 5) => {
  const { data, loading, fetchMore } = useQuery(GET_COMMENTS_BY_PLACE_QUERY, {
    variables: { placeId, userId, skip, take },
    fetchPolicy: 'network-only',
  });

  return {
    initialComments: data?.commentsByPlace.comments || [],
    totalCount: data?.commentsByPlace.totalCount || 0,
    loading,
    fetchMore,
  };
};

export const useReplies = (commentId: number, userId?: number, skip = 0, take = 5) => {
  const { data, loading, error, fetchMore } = useQuery(GET_REPLIES_QUERY, {
    variables: { commentId: +commentId, userId, skip, take },
    skip: !commentId,
    fetchPolicy: 'network-only',
  });

  const loadMore = async () => {
    const result = await fetchMore({
      variables: {
        commentId: +commentId,
        userId,
        skip: data?.repliesByComment.replies.length || 0,
        take,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          repliesByComment: {
            __typename: 'RepliesByComment',
            replies: [
              ...prev.repliesByComment.replies,
              ...fetchMoreResult.repliesByComment.replies,
            ],
            totalCount: fetchMoreResult.repliesByComment.totalCount,
          },
        };
      },
    });

    return result.data.repliesByComment.replies;
  };

  return {
    replies: data?.repliesByComment.replies || [],
    totalCount: data?.repliesByComment.totalCount || 0,
    loading,
    error,
    loadMore,
  };
};

export const useCreateComment = () => {
  const client = useApolloClient();
  const [createCommentMutation, createCommentResult] = useMutation(CREATE_COMMENT_MUTATION);

  const createComment = async (input: CreateCommentInput): Promise<Comment | undefined> => {
    const { data } = await createCommentMutation({
      variables: { createCommentInput: input },
    });

    const newComment = data?.createComment;
    if (!newComment) return undefined;

    const fullComment = await client.query({
      query: GET_COMMENT_QUERY,
      variables: {
        id: +newComment.id,
        userId: +input.userId,
      },
      fetchPolicy: 'network-only',
    });

    return fullComment.data?.comment;
  };

  return { createComment, createCommentResult };
};

export const useUpdateComment = () => {
  const [ updateCommentMutation, updateCommentResult ] = useMutation(UPDATE_COMMENT_MUTATION);

  const updateComment = async (id: number, text: string) => {
    const { data } = await updateCommentMutation({
      variables: { id, text },
    });
    return data?.updateComment;
  };

  return { updateComment, updateCommentResult };
}

export const useRemoveComment = () => {
  const [ removeCommentMutation, removeCommentResult ] = useMutation(REMOVE_COMMENT_MUTATION);

  const removeComment = async (id: number) => {
    const { data } = await removeCommentMutation({
      variables: { id },
    });
    return data?.removeComment;
  };

  return { removeComment, removeCommentResult };
};

export const useLikeComment = () => {
  const [ likeCommentMutation, likeCommentResult ] = useMutation(LIKE_COMMENT_MUTATION);

  const likeComment = async (id: number) => {
    const { data } = await likeCommentMutation({
      variables: { id },
    });
    return data?.likeComment;
  };

  return { likeComment, likeCommentResult };
};

export const useDislikeComment = () => {
  const [ dislikeCommentMutation, dislikeCommentResult ] = useMutation(DISLIKE_COMMENT_MUTATION);

  const dislikeComment = async (id: number) => {
    const { data } = await dislikeCommentMutation({
      variables: { id },
    });
    return data?.dislikeComment;
  };

  return { dislikeComment, dislikeCommentResult };
};

export const useVoteComment = () => {
  const [ voteCommentMutation, voteCommentResult ] = useMutation(VOTE_COMMENT_MUTATION);

  const voteComment = async (userId: number, commentId: number, isLike: boolean) => {
    const { data } = await voteCommentMutation({
      variables: { userId, commentId, isLike },
    });
    return data?.voteComment;
  };

  return { voteComment, voteCommentResult };
};
