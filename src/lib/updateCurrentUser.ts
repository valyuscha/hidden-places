import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { GET_CURRENT_USER_QUERY } from '@/graphql/user';
import { UserLoginData } from './types';

export const updateCurrentUser = async (
  client: ApolloClient<NormalizedCacheObject>
): Promise<UserLoginData | null> => {
  try {
    const { data } = await client.query({
      query: GET_CURRENT_USER_QUERY,
      fetchPolicy: 'network-only',
    });

    const user = data?.currentUser;

    if (user) {
      client.writeQuery({
        query: GET_CURRENT_USER_QUERY,
        data: { currentUser: user },
      });
    }

    return user ?? null;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return null;
  }
};
