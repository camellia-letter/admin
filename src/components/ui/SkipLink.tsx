import type { ReactNode } from 'react';
import { Anchor } from '@mantine/core';

interface SkipLinkProps {
  href: string;
  children: ReactNode;
}

export const SkipLink = ({ href, children }: SkipLinkProps) => {
  return (
    <Anchor
      href={href}
      style={{
        position: 'absolute',
        left: -9999,
        zIndex: 100,
      }}
      styles={{
        root: {
          '&:focus': {
            position: 'absolute',
            top: 'var(--mantine-spacing-md)',
            left: 'var(--mantine-spacing-md)',
            backgroundColor: 'var(--mantine-color-blue-6)',
            color: 'white',
            padding: 'var(--mantine-spacing-sm) var(--mantine-spacing-md)',
            borderRadius: 'var(--mantine-radius-md)',
            zIndex: 50,
          },
        },
      }}
    >
      {children}
    </Anchor>
  );
};
