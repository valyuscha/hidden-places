import { FormActionsProps } from './types';
import s from './styles.module.scss';

export const FormActions = ({ isEdit, isSubmitting }: FormActionsProps) => (
  <div className={s.formActions}>
    <button type="submit" className={s.submitButton} disabled={isSubmitting}>
      {isSubmitting ? 'Submitting...' : isEdit ? 'Update place' : 'Create place'}
    </button>
  </div>
);
