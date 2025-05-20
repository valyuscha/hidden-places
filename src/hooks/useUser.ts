'use client';

import { useQuery, useMutation } from '@apollo/client';
import {
  GET_USERS_QUERY,
  GET_USER_QUERY,
  CREATE_USER_MUTATION,
  DELETE_USER_MUTATION,
  GET_CURRENT_USER_QUERY,
} from '@/graphql/user';

interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

export const useCurrentUser = () => {
  const { data, loading, error, refetch } = useQuery(GET_CURRENT_USER_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    currentUser: data?.currentUser,
    loading,
    error,
    refetch,
  };
};

export const useUsers = () => {
  const { data, loading, error, refetch } = useQuery(GET_USERS_QUERY);
  return {
    users: data?.users || [],
    loading,
    error,
    refetch,
  };
};

export const useUser = (id?: number) => {
  const { data, loading, error, refetch } = useQuery(GET_USER_QUERY, {
    variables: { id },
    skip: !id,
  });
  return {
    user: data?.user,
    loading,
    error,
    refetch,
  };
};

export const useCreateUser = () => {
  const [ createUserMutation, createUserResult ] = useMutation(CREATE_USER_MUTATION);

  const createUser = async (input: CreateUserInput) => {
    const { data } = await createUserMutation({
      variables: { createUserInput: input },
    });
    return data?.createUser;
  };

  return { createUser, createUserResult };
};

export const useDeleteUser = () => {
  const [ deleteUserMutation, deleteUserResult ] = useMutation(DELETE_USER_MUTATION);

  const deleteUser = async (id: number) => {
    const { data } = await deleteUserMutation({
      variables: { id },
    });
    return data?.deleteUser;
  };

  return { deleteUser, deleteUserResult };
};
