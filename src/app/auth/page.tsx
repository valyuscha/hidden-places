'use client';

import { useEffect, useState } from 'react';
import { LoginForm, RegisterForm } from '@/components';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useUser';

import s from '@/components/auth/styles.module.scss';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const router = useRouter();
  const { currentUser, loading } = useCurrentUser();

  useEffect(() => {
    if (!loading && currentUser) {
      router.replace('/places');
    }
  }, [loading, currentUser, router]);

  return (
    <div className={s.authCard}>
      <div className={s.toggleButtons}>
        <button
          onClick={() => setIsLogin(true)}
          className={isLogin ? s.activeTab : ''}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={!isLogin ? s.activeTab : ''}
        >
          Register
        </button>
      </div>

      {isLogin ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}
