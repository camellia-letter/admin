import { Modal, Button, Group, Text } from '@mantine/core';

interface AppAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
}

export const AppAlertDialog = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'default',
}: AppAlertDialogProps) => {
  const handleClose = () => onOpenChange(false);

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const confirmColor = variant === 'danger' ? 'red' : 'blue';

  return (
    <Modal opened={open} onClose={handleClose} title={title} centered size="sm">
      <Text size="sm" mb="lg">
        {description}
      </Text>
      <Group justify="flex-end">
        <Button variant="subtle" onClick={handleClose}>
          {cancelText}
        </Button>
        <Button color={confirmColor} onClick={handleConfirm}>
          {confirmText}
        </Button>
      </Group>
    </Modal>
  );
};
