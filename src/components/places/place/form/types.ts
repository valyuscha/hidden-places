import { FieldPathByValue } from 'react-hook-form';
import { PlaceSchema } from './schema';
import type { InferType } from 'yup';

export type PlaceValidationSchema = InferType<typeof PlaceSchema>;

export interface PlaceFormValues extends PlaceValidationSchema {
  imageFile: File | null;
  tags: ('hidden' | 'explore' | 'historic' | 'nature' | undefined)[];
  createdById?: number;
  id?: number;
}

export type ArrayFieldNames = FieldPathByValue<PlaceFormValues, string[]>;

export interface PlaceFormProps {
  initialValues?: PlaceFormValues;
}

export interface PlaceFormState {
  title: string;
  description: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  tags: ('hidden' | 'explore' | 'historic' | 'nature' | undefined)[];
  imageFile?: File | null;
  imageUrl: string;
  imagePublicId: string;
  createdById: number;
}

export interface TagInputProps {
  name: ArrayFieldNames;
}

export interface FormActionsProps {
  isEdit: boolean;
  isSubmitting: boolean;
}

export interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (lat: number, lng: number, country: string, city: string) => void;
}

export interface CorrectionConfirmModalProps {
  correctedPayload: PlaceFormState;
  onCancel: () => void;
  onConfirm: () => void;
}

export type Tag = 'hidden' | 'explore' | 'historic' | 'nature' | undefined;
