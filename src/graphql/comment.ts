import { gql } from '@apollo/client';

export const GET_COMMENT_QUERY = gql`
  query GetComment($id: Int!, $userId: Int) {
    comment(id: $id, userId: $userId) {
      id
      text
      likes
      dislikes
      hasUserLiked
      hasUserDisliked
      createdAt
      user {
        id
        name
      }
      replies {
        id
        text
        user {
          id
          name
        }
        hasUserLiked
        hasUserDisliked
      }
      hasMoreReplies
    }  
  }
`;

export const GET_COMMENTS_BY_PLACE_QUERY = gql`
  query CommentsByPlace($placeId: Int!, $userId: Int, $skip: Int) {
    commentsByPlace(placeId: $placeId, userId: $userId, skip: $skip) {
      comments {
        id
        text
        likes
        dislikes
        hasUserLiked
        hasUserDisliked
        user {
          id
          name
        }
        replies {
          id
          text
          user {
            id
            name
          }
          hasUserLiked
          hasUserDisliked
        }
        hasMoreReplies
        createdAt
      }
      totalCount
    }
  }
`;

export const GET_REPLIES_QUERY = gql`
  query RepliesByComment($commentId: Int!, $userId: Int, $skip: Int = 0, $take: Int = 5) {
    repliesByComment(commentId: $commentId, userId: $userId, skip: $skip, take: $take) {
      replies {
        id
        text
        user {
          id
          name
        }
        hasUserLiked
        hasUserDisliked
      }
      totalCount
    }
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($createCommentInput: CreateCommentInput!) {
    createComment(createCommentInput: $createCommentInput) {
      id
      text
      user {
        id
        name
      }
      createdAt
    }
  }
`;

export const UPDATE_COMMENT_MUTATION = gql`
  mutation UpdateComment($id: Int!, $text: String!) {
    updateComment(id: $id, text: $text) {
      id
      text
      updatedAt
    }
  }
`;

export const REMOVE_COMMENT_MUTATION = gql`
  mutation RemoveComment($id: Int!) {
    removeComment(id: $id)
  }
`;

export const LIKE_COMMENT_MUTATION = gql`
  mutation LikeComment($id: Int!) {
    likeComment(id: $id) {
      id
      likes
    }
  }
`;

export const DISLIKE_COMMENT_MUTATION = gql`
  mutation DislikeComment($id: Int!) {
    dislikeComment(id: $id) {
      id
      dislikes
    }
  }
`;

export const VOTE_COMMENT_MUTATION = gql`
  mutation VoteComment($userId: Int!, $commentId: Int!, $isLike: Boolean!) {
    voteComment(userId: $userId, commentId: $commentId, isLike: $isLike) {
      id
      likes
      dislikes
      hasUserLiked
      hasUserDisliked
    }
  }
`;
