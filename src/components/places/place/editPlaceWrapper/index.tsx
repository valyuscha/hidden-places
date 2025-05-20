'use client';

import * as React from 'react';
import { PlaceForm } from '@/components/places/place/form';
import { PlaceFormValues } from '@/components/places/place/form/types';
import { usePlace } from '@/hooks/usePlace';
import { EditPageProps, ParamsType } from './types';

export const EditPlaceWrapper = ({ params }: EditPageProps) => {
  const { id } = React.use(params as ParamsType);
  const { place, loading, error } = usePlace(+id);

  if (loading) return <p>Loading…</p>;
  if (error || !place) return <p>Place not found</p>;

  const init: PlaceFormValues = {
    id: place.id,
    title: place.title,
    description: place.description || '',
    country: place.country,
    city: place.city,
    latitude: place.latitude,
    longitude: place.longitude,
    tags: place.tags,
    imageUrl: place.imageUrl || '',
    imagePublicId: place.imagePublicId || '',
    imageFile: null,
    createdById: place.createdBy.id,
  };

  return <PlaceForm initialValues={init} />;
};
