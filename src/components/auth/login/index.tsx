'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ApolloClient, NormalizedCacheObject, useApolloClient } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { updateCurrentUser } from '@/lib/updateCurrentUser';

import { loginSchema } from '@/lib/validation';
import { LoginFormValues } from '../types';
import s from '../styles.module.scss';

export const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [ formError, setFormError ] = useState('');
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormValues)=> {
    if (!isValid)  return;
    try {
      const isLoggedIn = await login(data);
      if (isLoggedIn) {
        await updateCurrentUser(client);
        reset();
        setFormError('');
        router.push('/places');
      } else {
        setFormError('Invalid email or password.');
      }
    } catch (error) {
      setFormError('Invalid email or password.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Login</h2>
      {formError && <div className={s.errorBlock}>{formError}</div>}
      <div className={s.inputGroup}>
        <label>Email</label>
        <input type="email" {...register('email')} />
        <p className={s.error}>{errors.email?.message}</p>
      </div>
      <div className={s.inputGroup}>
        <label>Password</label>
        <input type="password" {...register('password')} />
        <p className={s.error}>{errors.password?.message}</p>
      </div>
      <button type="submit" disabled={!isValid} className={s.primaryBtn}>
        Login
      </button>
    </form>
  );
};
