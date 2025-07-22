import { useState, useCallback } from 'react';
import { ModalState } from '@/types';

export function useModal() {
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    medIdx: null,
    isAdd: false,
  });

  const openModal = useCallback((isAdd: boolean = false, medIdx: number | null = null) => {
    setModalState({
      open: true,
      medIdx,
      isAdd,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      open: false,
      medIdx: null,
      isAdd: false,
    });
  }, []);

  const openEditModal = useCallback((medIdx: number) => {
    setModalState({
      open: true,
      medIdx,
      isAdd: false,
    });
  }, []);

  const openAddModal = useCallback(() => {
    setModalState({
      open: true,
      medIdx: null,
      isAdd: true,
    });
  }, []);

  return {
    modalState,
    openModal,
    closeModal,
    openEditModal,
    openAddModal,
    isOpen: modalState.open,
    isAdd: modalState.isAdd,
    medIdx: modalState.medIdx,
  };
} 