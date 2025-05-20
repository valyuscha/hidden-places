import { useFormContext } from 'react-hook-form';
import { PlaceFormValues } from './types';
import s from './styles.module.scss';

export const BasicFields = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<PlaceFormValues>();

  return(
    <>
      <div className={s.formItem}>
        <label className={s.formLabel} htmlFor="title">Title</label>
        <input id="title" {...register('title')} className={s.formControl}/>
        {errors.title && <p className={s.error}>{errors.title.message}</p>}
      </div>
      <div className={s.formItem}>
        <label className={s.formLabel} htmlFor="description">Description</label>
        <textarea id="description" {...register('description')} className={s.formControl}/>
        {errors.description && <p className={s.error}>{errors.description.message}</p>}
      </div>
    </>
  );
};
