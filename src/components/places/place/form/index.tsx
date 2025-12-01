'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreatePlace, useUpdatePlace } from '@/hooks/usePlace';
import { validateLocation } from '@/lib/validateLocation';
import { uploadImage } from '@/lib/uploadImage';

import { PlaceFormProps, PlaceFormState, PlaceFormValues } from './types';
import { PlaceSchema } from './schema';

import { BasicFields } from './basicFields';
import { LocationFields } from './locationFields';
import { TagInput } from './tagInput';
import { FileUpload } from './fileUpload';
import { FormActions } from './formActions';
import { CorrectionConfirmModal } from './correctionConfirmModal';

import s from './styles.module.scss';

export const PlaceForm = ({ initialValues }: PlaceFormProps) => {
  const isEdit = Boolean(initialValues?.id);
  const router = useRouter();
  const { createPlace } = useCreatePlace();
  const { updatePlace } = useUpdatePlace();
  const [ showCorrectionConfirm, setShowCorrectionConfirm ] = useState(false);
  const [ correctedPayload, setCorrectedPayload ] = useState<PlaceFormState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<PlaceFormValues>({
    resolver: yupResolver(PlaceSchema) as Resolver<PlaceFormValues>,
    defaultValues: {
      title: initialValues?.title ?? '',
      description: initialValues?.description ?? '',
      country: initialValues?.country ?? '',
      city: initialValues?.city ?? '',
      latitude: initialValues?.latitude?.toString() ?? '',
      longitude: initialValues?.longitude?.toString() ?? '',
      tags: initialValues?.tags ?? [],
      imageFile: null,
      imageUrl: initialValues?.imageUrl ?? '',
      imagePublicId: initialValues?.imagePublicId ?? '',
      createdById: initialValues?.createdById,
    },
  });

  const mutateAndRedirect = async (payload: PlaceFormState, data: PlaceFormValues) => {
    if (data.imageFile) {
      try {
        setIsSubmitting(true);
        const uploaded = await uploadImage(data.imageFile);
        payload.imageUrl = uploaded.imageUrl;
        payload.imagePublicId = uploaded.publicId;
      } catch (err) {
        console.error('Upload failed:', err);
        methods.setError('imageFile', {
          type: 'manual',
          message: 'Image upload failed',
        });
        return;
      } finally {
        setIsSubmitting(false);
      }
    }
    if (isEdit && initialValues!.id) {
      const updated = await updatePlace(
        +initialValues!.id,
        {
          title: payload.title,
          description: payload.description,
          imageUrl: payload.imageUrl,
          tags: payload.tags,
        },
        payload.createdById,
      );
      router.push(`/places/${updated.id}`);
    } else {
      const created = await createPlace(payload);
      router.push(`/places/${created.id}`);
    }
  }

  const onSubmit = methods.handleSubmit(async data => {
    const lat = Number(data.latitude);
    const lon = Number(data.longitude);

    const { valid, error, corrected } = await validateLocation(lat, lon, data.country, data.city);

    if (!valid) {
      methods.setError('latitude', {
        type: 'manual',
        message: error || 'Invalid coordinates',
      });
      methods.setError('longitude', {
        type: 'manual',
        message: error || 'Invalid coordinates',
      });
      return;
    }

    let correctedCountry = data.country;
    let correctedCity = data.city;
    let hasCorrection = false;

    if (corrected?.country) {
      correctedCountry = corrected.country;
      hasCorrection = true;
      methods.setValue('country', corrected.country);
    }

    if (corrected?.city) {
      correctedCity = corrected.city;
      hasCorrection = true;
      methods.setValue('city', corrected.city);
    }

    const payload: PlaceFormState = {
      title: data.title,
      description: data.description || '',
      country: correctedCountry,
      city: correctedCity,
      latitude: lat,
      longitude: lon,
      tags: data.tags,
      imageUrl: data.imageUrl,
      imagePublicId: data.imagePublicId || '',
      createdById: data.createdById!,
    };

    if (hasCorrection) {
      setCorrectedPayload(payload);
      setShowCorrectionConfirm(true);
      return;
    }

    await mutateAndRedirect(payload, data);
  });

  return (
    <FormProvider {...methods}>
      <form className={s.placeForm} onSubmit={onSubmit}>
        <BasicFields />
        <LocationFields isEdit={isEdit} />
        <TagInput />
        <FileUpload />
        <FormActions isEdit={isEdit} isSubmitting={isSubmitting} />
      </form>
      {showCorrectionConfirm && correctedPayload && (
        <CorrectionConfirmModal
          correctedPayload={correctedPayload}
          onCancel={() => {
            setShowCorrectionConfirm(false);
            setCorrectedPayload(null);
          }}
          onConfirm={async () => {
            setShowCorrectionConfirm(false);
            const formData = methods.getValues();
            await mutateAndRedirect(correctedPayload, formData);
          }}
        />
      )}
    </FormProvider>
  );
};
