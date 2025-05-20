import * as yup from 'yup';

export const allowedTags = ['hidden', 'explore', 'historic', 'nature'] as const;

export const PlaceSchema = yup
  .object({
      title: yup.string().required('Title is a required field'),
      description: yup.string().optional(),
      country: yup.string().required('Country is a required field'),
      city: yup.string().required('City is a required field'),
      latitude: yup
        .string()
        .required('Latitude is a required field')
        .test('is-number', 'Latitude must be a number', val => val !== undefined && !isNaN(Number(val))),
      longitude: yup
        .string()
        .required('Longitude is a required field')
        .test('is-number', 'Longitude must be a number', val => val !== undefined && !isNaN(Number(val))),
      tags: yup
        .array()
        .of(yup.string().oneOf(allowedTags, 'Invalid tag'))
        .min(1, 'At least one tag is required')
        .required('Tags are required'),
      imageFile: yup.mixed<File>().nullable(),
      imageUrl: yup.string().required('Image is required'),
      imagePublicId: yup.string(),
      createdById: yup.number().optional(),
      id: yup.number().optional(),
  })
  .required();
