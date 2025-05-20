'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useUser';

import Link from 'next/link';
import Image from 'next/image';
import s from './layout.module.scss';

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const isAuthPage = pathname.startsWith('/auth');

  const isLoggedIn = !!currentUser;

  const handleCreateClick = () => {
    if (isLoggedIn) {
      router.push('/places/create');
    } else {
      router.push('/auth');
    }
  };

  return (
    <header key={pathname} className={s.header}>
      <div className={s.logo}>
        <Image src="/hidden-places-logo.png" alt="Logo" width={60} height={63} />
        <Link href="/places" className={s.placesLink}>
          Browse Places
        </Link>
      </div>
      {!isAuthPage && (
        <div className={s.right}>
          <button onClick={handleCreateClick} className={s.createBtn}>
            + Add Place
          </button>
          {isLoggedIn ? (
            <Link href="/user" className={s.userBlock}>
              <Image
                src="/hidden-places-avatar.png"
                alt="User Avatar"
                width={50}
                height={50}
                className={s.avatar}
              />
              <span className={s.userName}>{currentUser.name}</span>
            </Link>
          ) : (
            <Link href="/auth" className={s.loginLink}>
              Log in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
