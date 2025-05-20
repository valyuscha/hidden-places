'use client';

import * as React from 'react';
import { usePlace } from '@/hooks/usePlace';
import { CommentSection } from '@/components';
import { ParamsType, PlacePageProps } from './types';
import dynamic from 'next/dynamic';

const PlaceDetails = dynamic(() =>
    import('@/components/places/place/placeDetails').then((mod) => mod.PlaceDetails),
  { ssr: false }
);

export default function PlacePage ({ params }: PlacePageProps) {
  const { id } = React.use(params as ParamsType);
  const { place, loading, error } = usePlace(+id);

  if (loading) return <p>Loading...</p>;
  if (error || !place) {
    return <p>Error loading place</p>;
  }

  return (
    <main>
      <PlaceDetails place={place} />
      <CommentSection placeId={place.id} />
    </main>
  );
};
