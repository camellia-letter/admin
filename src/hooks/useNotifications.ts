import { notifications } from '@mantine/notifications';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

export const useToast = () => {
  const addToast = (type: NotificationType, message: string) => {
    const colorMap = {
      success: 'green',
      error: 'red',
      info: 'blue',
      warning: 'yellow',
    };

    notifications.show({
      title: type === 'error' ? '오류' : type === 'success' ? '성공' : '알림',
      message,
      color: colorMap[type],
      position: 'top-right',
    });
  };

  return { addToast };
};
