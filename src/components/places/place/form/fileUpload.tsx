import { useEffect, ChangeEvent } from 'react';
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    } else {
      clearErrors('imageUrl');
      setFile(selectedFile);
    }
  };

  return (
    <div className={`${s.formItem} ${s['formItem--file']}`}>
      <label className={s.formLabel}>Image</label>
      <div className={s.fileWrapper}>
        <button type="button" className={s.uploadBtn}>
          Choose Image
        </button>
        <div className={s.fileName}>
          {previewUrl ? previewUrl.split('/').pop() : 'No file chosen'}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      {imageUrlError && <p className={s.error}>{imageUrlError.message}</p>}
      {previewUrl && (
        <img src={previewUrl} alt="Preview" className={s.imagePreview} />
      )}
    </div>
  );
};

