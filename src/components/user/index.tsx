'use client';

import { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useCurrentUser, useDeleteUser, useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLogout } from '@/hooks/useAuth';
import { DeleteConfirmModal } from '@/components/deleteConfirmModal';
import { Place } from '@/components/places/types';

import s from './styles.module.scss';

export const UserProfile = () => {
  const client = useApolloClient();
  const router = useRouter();
  const { currentUser, loading: loadingCurrent } = useCurrentUser();
  const [ isDeleting, setIsDeleting ] = useState(false);
  const { user, loading: loadingUser } = useUser(
    !isDeleting && currentUser ? Number(currentUser.id) : undefined
  );
  const { logout } = useLogout();
  const { deleteUser } = useDeleteUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!loadingCurrent && !currentUser) {
      router.push('/auth');
    }
  }, [loadingCurrent, currentUser, router]);

  const handleLogout = async () => {
    try {
      await logout();
      await client.clearStore();
      await client.resetStore();
      router.replace('/auth');
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;

    try {
      setIsDeleting(true);
      await deleteUser(+currentUser.id);
      await logout();
      await client.clearStore();
      await client.resetStore();
      router.replace('/places');
    } catch (err) {
      console.error('Failed to delete account:', err);
    } finally {
      setIsDeleting(false);
      closeModal();
    }
  };

  if (loadingCurrent || loadingUser) return <p>Loading...</p>;
  if (!currentUser) return null;
  if (!user) return <p>Could not load user data</p>;

  return (
    <div className={s.profile}>
      <div className={s.userInfo}>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
        <div className={s.buttonGroup}>
          <button className={s.logoutBtn} onClick={handleLogout}>
            Log out
          </button>
          <button
            className={s.deleteBtn}
            onClick={openModal}
            disabled={isDeleting}
          >
            {isDeleting ? 'Removing...' : 'Remove Account'}
          </button>
        </div>
      </div>
      <div className={s.places}>
        <h2>Your added places</h2>
        {user.places?.length ? (
          <div className={s.placeList}>
            {user.places.map((place: Place) => (
              <Link
                key={place.id}
                href={`/places/${place.id}`}
                className={s.card}
              >
                <div className={s.imageWrapper}>
                  <Image
                    src={place.imageUrl || '/placeholder.png'}
                    alt={place.title}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={s.cardImage}
                  />
                </div>
                <div className={s.cardContent}>
                  <h3>{place.title}</h3>
                  <p>{place.description?.slice(0, 80)}...</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>No places created yet</p>
        )}
      </div>
      {isModalOpen && (
        <DeleteConfirmModal
          deleteItem="account"
          onCancel={closeModal}
          onConfirm={handleDeleteAccount}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};
