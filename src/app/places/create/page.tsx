'use client';

import { PlaceForm } from '@/components/places/place/form';
import { useCurrentUser } from '@/hooks/useUser';

const CreatePlacePage = () => {
  const { currentUser, loading, error } = useCurrentUser();

  if (loading) {
    return <p>Loading user…</p>;
  }

  if (error || !currentUser) {
    return <p>You must be logged in to create a place.</p>;
  }

  return (
    <PlaceForm
      initialValues={{
        title: '',
        description: '',
        country: '',
        city: '',
        latitude: '',
        longitude: '',
        tags: [],
        imageUrl: '',
        imagePublicId: '',
        imageFile: null,
        createdById: currentUser.id,
      }}
    />
  );
};

export default CreatePlacePage;
