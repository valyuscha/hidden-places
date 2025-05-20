'use client';

import { DeleteConfirmModalProps } from './types';
import s from './styles.module.scss';

export const DeleteConfirmModal = ({ onConfirm, onCancel, isLoading, deleteItem }: DeleteConfirmModalProps) => {
  return (
    <div className={s.modalBackdrop}>
      <div className={s.modal}>
        <h3>Delete this {deleteItem}?</h3>
        <p>This action cannot be undone.</p>
        <div className={s.modalActions}>
          <button className={s.cancelBtn} onClick={onCancel}>Cancel</button>
          <button className={s.confirmBtn} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Yes, delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
