import { useEffect, ChangeEvent, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { PlaceFormValues } from './types';
import s from './styles.module.scss';

export const FileUpload = () => {
  const { control, setValue, setError, clearErrors } = useFormContext<PlaceFormValues>();

  const {
    field: { value: file, onChange: setFile },
  } = useController<PlaceFormValues, 'imageFile'>({
    name: 'imageFile',
    control,
  });

  const {
    field: { value: previewUrl },
    fieldState: { error: imageUrlError },
  } = useController<PlaceFormValues, 'imageUrl'>({
    name: 'imageUrl',
    control,
  });

  useEffect(() => {
    if (file instanceof Blob) {
      const url = URL.createObjectURL(file);
      setValue('imageUrl', url, { shouldValidate: true });
      return () => URL.revokeObjectURL(url);
    }
  }, [file, setValue]);

  const [isConverting, setIsConverting] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const MAX_SIZE_MB = 5;
    const maxSize = MAX_SIZE_MB * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setError('imageUrl', {
        type: 'manual',
        message: `File is too large. Maximum size is ${MAX_SIZE_MB}MB.`,
      });
      setFile(null);
      return;
    }

    clearErrors('imageUrl');

    // Handle HEIC/HEIF images
    if (selectedFile.type === 'image/heic' || selectedFile.type === 'image/heif') {
      try {
        setIsConverting(true);
        // Dynamically import heic2any
        const heic2any = (await import('heic2any')).default;

        // Convert HEIC to JPEG
        const convertedBlob = await heic2any({
          blob: selectedFile,
          toType: 'image/jpeg',
          quality: 0.9,
        }) as BlobPart;

        // Create a new File object from the converted blob
        const convertedFile = new File(
          [convertedBlob instanceof Blob ? convertedBlob : new Blob([convertedBlob])],
          selectedFile.name.replace(/\.(heic|heif)$/i, '.jpg'),
          {
            type: 'image/jpeg',
            lastModified: new Date().getTime()
          }
        );

        setFile(convertedFile);
      } catch (error) {
        console.error('HEIC conversion error:', error);
        setError('imageUrl', {
          type: 'manual',
          message: `Failed to convert HEIC image: ${error}`,
        });
        setFile(null);
      } finally {
        setIsConverting(false);
      }
    } else {
      // For non-HEIC images, just set the file directly
      setFile(selectedFile);
    }
  };

  return (
    <div className={`${s.formItem} ${s['formItem--file']}`}>
      <label className={s.formLabel}>Image</label>
      <div className={s.fileWrapper}>
        <button type="button" className={s.uploadBtn} disabled={isConverting}>
          {isConverting ? 'Converting...' : 'Choose Image'}
        </button>
        <div className={s.fileName}>
          {isConverting
            ? 'Converting HEIC to JPEG...'
            : (previewUrl ? previewUrl.split('/').pop() : 'No file chosen')}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isConverting}
        />
      </div>
      {imageUrlError && <p className={s.error}>{imageUrlError.message}</p>}
      {isConverting && <p>Converting image, please wait...</p>}
      {previewUrl && !isConverting && (
        <img src={previewUrl} alt="Preview" className={s.imagePreview} />
      )}
    </div>
  );
};
