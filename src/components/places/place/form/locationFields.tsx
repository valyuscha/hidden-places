import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MapModal } from './mapModal';
import { PlaceFormValues } from './types';
import s from './styles.module.scss';

export const LocationFields = ({ isEdit }: { isEdit: boolean }) => {
  const { register, setValue, formState: { errors } } = useFormContext<PlaceFormValues>();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [loadingGeocode, setLoadingGeocode] = useState(false);

  const handleSelectLocation = async (lat: number, lng: number) => {
    setValue('latitude', lat.toString());
    setValue('longitude', lng.toString());
    setIsMapOpen(false);
    setLoadingGeocode(true);

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await res.json();
      const address = data.address || {};

      setValue('country', address.country || '');
      setValue('city', address.city || address.town || address.village || '');
    } catch (e) {
      console.error('Reverse geocoding failed:', e);
    } finally {
      setLoadingGeocode(false);
    }
  };

  return (
    <>
      <div className={s.formRow}>
        <div className={s.formItem}>
          <label className={s.formLabel} htmlFor="country">Country</label>
          <div className={s.inputWithSpinner}>
            <input id="country" {...register('country')} className={s.formControl} readOnly={isEdit} />
            {loadingGeocode && <div className={s.spinner} />}
          </div>
          {errors.country && <p className={s.error}>{errors.country.message}</p>}
        </div>
        <div className={s.formItem}>
          <label className={s.formLabel} htmlFor="city">City</label>
          <div className={s.inputWithSpinner}>
            <input id="city" {...register('city')} className={s.formControl} readOnly={isEdit} />
            {loadingGeocode && <div className={s.spinner} />}
          </div>
          {errors.city && <p className={s.error}>{errors.city.message}</p>}
        </div>
      </div>
      <div className={s.formRow}>
        <div className={s.formItem}>
          <label className={s.formLabel} htmlFor="latitude">Latitude</label>
          <input
            id="latitude"
            type="number"
            step="any"
            readOnly={isEdit}
            {...register('latitude')}
            className={s.formControl}
          />
          {errors.latitude && <p className={s.error}>{errors.latitude.message}</p>}
        </div>
        <div className={s.formItem}>
          <label className={s.formLabel} htmlFor="longitude">Longitude</label>
          <input
            id="longitude"
            type="number"
            step="any"
            readOnly={isEdit}
            {...register('longitude')}
            className={s.formControl}
          />
          {errors.longitude && <p className={s.error}>{errors.longitude.message}</p>}
        </div>
      </div>
      {!isEdit && (
        <button type="button" className={s.mapButton} onClick={() => setIsMapOpen(true)}>
          Choose on map
        </button>
      )}
      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelectLocation={handleSelectLocation}
      />
    </>
  );
};
