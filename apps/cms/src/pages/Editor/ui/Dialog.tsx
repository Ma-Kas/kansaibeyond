import { Group } from '@mantine/core';
import './Dialog.css';

import { ReactNode } from 'react';

type Props = Readonly<{
  'data-test-id'?: string;
  children: ReactNode;
}>;

export function DialogButtonsList({ children }: Props): JSX.Element {
  return <div className='DialogButtonsList'>{children}</div>;
}

export function DialogButtonsGrid({ children }: Props): JSX.Element {
  return <div className='DialogButtonGrid'>{children}</div>;
}

export function DialogActions({
  'data-test-id': dataTestId,
  children,
}: Props): JSX.Element {
  return (
    <div className='DialogActions' data-test-id={dataTestId}>
      {children}
    </div>
  );
}

export function DialogFooter({
  'data-test-id': dataTestId,
  children,
}: Props): JSX.Element {
  return (
    <Group className='DialogFooter' data-test-id={dataTestId}>
      {children}
    </Group>
  );
}
