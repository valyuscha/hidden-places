export interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  deleteItem: string;
}
