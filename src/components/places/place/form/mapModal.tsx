'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapModalProps } from './types';
import s from './styles.module.scss';

const MapInner = dynamic(() => import('./mapInner'), { ssr: false });

export const MapModal = ({ isOpen, onClose, onSelectLocation }: MapModalProps) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={s.modalOverlay}>
      <div className={s.modalContent}>
        <button className={s.closeButton} onClick={onClose}>×</button>
        <MapInner onSelectLocation={onSelectLocation} />
      </div>
    </div>
  );
};
