import { useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void>;
}

export function useConfirm() {
  const [state, setState] = useState({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    isLoading: false,
    onConfirm: async () => {},
  });

  const openConfirm = (options: ConfirmOptions) => {
    setState({
      isOpen: true,
      title: options.title,
      description: options.description,
      confirmText: options.confirmText ?? "Confirmar",
      cancelText: options.cancelText ?? "Cancelar",
      isLoading: false,
      onConfirm: options.onConfirm,
    });
  };

  const closeConfirm = () => {
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await state.onConfirm();
      closeConfirm();
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const ConfirmDialog = () => (
    <ConfirmModal
      isOpen={state.isOpen}
      title={state.title}
      description={state.description}
      confirmText={state.confirmText}
      cancelText={state.cancelText}
      isLoading={state.isLoading}
      onConfirm={handleConfirm}
      onClose={closeConfirm}
    />
  );

  return { openConfirm, ConfirmDialog };
}
