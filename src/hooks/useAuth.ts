import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION, REGISTER_MUTATION, LOGOUT_MUTATION } from '@/graphql/auth';

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export const useAuth = () => {
  const [ loginMutation, loginResult ] = useMutation(LOGIN_MUTATION)
  const [ registerMutation, registerResult ] = useMutation(REGISTER_MUTATION);

  const login = async (input: LoginInput) => {
    const { data } = await loginMutation({
      variables: { loginInput: input },
    });
    return data?.login;
  };

  const register = async (input: RegisterInput) => {
    const { data } = await registerMutation({
      variables: { registerInput: input },
    });
    return data?.register;
  };

  return {
    login,
    loginResult,
    register,
    registerResult,
  };
};

export const useLogout = () => {
  const [logoutMutation, { loading, error }] = useMutation(LOGOUT_MUTATION);

  const logout = async () => {
    await logoutMutation();
  };

  return { logout, loading, error };
};
