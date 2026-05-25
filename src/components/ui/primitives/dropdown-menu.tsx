import { Menu } from '@mantine/core';
import type { ReactNode } from 'react';

interface DropdownMenuProps {
  children: ReactNode;
}

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  return <Menu>{children}</Menu>;
};

export const DropdownMenuTrigger = Menu.Target;
export const DropdownMenuContent = Menu.Dropdown;
export const DropdownMenuItem = Menu.Item;
export const DropdownMenuLabel = Menu.Label;
export const DropdownMenuDivider = Menu.Divider;
