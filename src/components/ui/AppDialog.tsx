import { Modal } from '@mantine/core';
import type { ReactNode } from 'react';

interface AppDialogProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
}

export const AppDialog = ({
  isOpen,
  open,
  onClose,
  onOpenChange,
  title,
  children,
  size = 'md',
  footer,
}: AppDialogProps) => {
  const opened = isOpen ?? open ?? false;
  const handleClose = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <Modal opened={opened} onClose={handleClose} title={title} size={size} centered>
      {children}
      {footer && (
        <div
          style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--mantine-color-gray-2)',
          }}
        >
          {footer}
        </div>
      )}
    </Modal>
  );
};
