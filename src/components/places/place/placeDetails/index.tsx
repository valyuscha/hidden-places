'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useUser';
import { useRemovePlace } from '@/hooks/usePlace';
import { DeleteConfirmModal } from '@/components/deleteConfirmModal';
import * as L from 'leaflet';

import { PlaceDetailsProps, IconDefaultWithPrivateMethod } from './types';
import s from './styles.module.scss';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export const PlaceDetails = ({ place }: PlaceDetailsProps) => {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { removePlace } = useRemovePlace();
  const [ , setLeaflet ] = useState<typeof L | null>(null);
  const [ showDeleteModal, setShowDeleteModal ] = useState(false);
  const [ isDeleting, setIsDeleting ] = useState(false);

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      delete (leaflet.Icon.Default.prototype as IconDefaultWithPrivateMethod)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconUrl: '/leaflet/marker-icon.png',
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      });
      setLeaflet(leaflet);
    });
  }, []);

  const handleEdit = () => {
    router.push(`/places/${place.id}/edit`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await removePlace(
        +place.id,
        isOwner && currentUser ? +currentUser.id : undefined
      );

      if (result) {
        router.replace('/places');
      }
    } catch (err) {
      console.error('Failed to delete place:', err);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const isOwner = currentUser?.id === place.createdBy.id;

  return (
    <section className={s.container}>
      {place.imageUrl && <img src={place.imageUrl} alt={place.title} className={s.image} />}
      <h1 className={s.title}>{place.title}</h1>
      <p className={s.desc}>{place.description}</p>
      <p className={s.location}>{place.city}, {place.country}</p>
      {isOwner && (
        <div className={s.actions}>
          <button className={s.editBtn} onClick={handleEdit}>Edit</button>
          <button className={s.deleteBtn} onClick={handleDeleteClick}>Delete</button>
        </div>
      )}
      <div className={s.mapContainer}>
        <MapContainer
          center={[place.latitude, place.longitude]}
          zoom={13}
          scrollWheelZoom={false}
          className={s.map}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[place.latitude, place.longitude]}>
            <Popup>{place.title}</Popup>
          </Marker>
        </MapContainer>
      </div>
      {showDeleteModal && (
        <DeleteConfirmModal
          deleteItem="place"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isLoading={isDeleting}
        />
      )}
    </section>
  );
};
