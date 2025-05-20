'use client';

import { CorrectionConfirmModalProps } from './types';
import s from './styles.module.scss';

export const CorrectionConfirmModal = ({
  correctedPayload,
  onCancel,
  onConfirm,
}: CorrectionConfirmModalProps) => {
  return (
    <div className={s.modalOverlay}>
      <div className={`${s.modalContent} ${s.confirmModal}`}>
        <p className={s.modalIntro}>
          <strong>Heads up!</strong> The entered <code>country</code> and/or <code>city</code> didn’t match the selected coordinates. We’ve corrected them based on the actual location:
        </p>
        <div className={s.modalFields}>
          <div><span>Country:</span> <strong>{correctedPayload.country}</strong></div>
          <div><span>City:</span> <strong>{correctedPayload.city}</strong></div>
        </div>
        <p className={s.modalQuestion}>Do you want to continue with the corrected values?</p>
        <div className={s.confirmModalActions}>
          <button className={s.cancelButton} onClick={onCancel}>Cancel</button>
          <button className={s.confirmButton} onClick={onConfirm}>Continue</button>
        </div>
      </div>
    </div>
  );
};
