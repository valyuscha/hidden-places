'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ApolloClient, NormalizedCacheObject, useApolloClient } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@/hooks/useAuth';
import { updateCurrentUser } from '@/lib/updateCurrentUser';

import { registerSchema } from '@/lib/validation';
import { RegisterFormValues } from '../types';
import s from '../styles.module.scss';

export const RegisterForm = () => {
  const router = useRouter();
  const { register: registerReq } = useAuth();
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormValues) => {
    if (!isValid) return;
    const isRegistered = await registerReq(data);
    if (isRegistered) {
      await updateCurrentUser(client);
      reset();
      router.push('/places');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Register</h2>
      <div className={s.inputGroup}>
        <label>Name</label>
        <input type="text" {...register('name')} />
        <p className={s.error}>{errors.name?.message}</p>
      </div>
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
        Register
      </button>
    </form>
  );
}
