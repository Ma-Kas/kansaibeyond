import { Paper } from '@mantine/core';
import cx from 'clsx';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import classes from './ContentSettingsModal.module.css';

interface ModalProps {
  isOpen: boolean;
  close: () => void;
  children: ReactNode;
}

const ContentSettingsModal = ({ isOpen, children }: ModalProps) => {
  return (
    <>
      {createPortal(
        <div className={classes['content_settings_modal_container']}>
          <Paper
            radius={0}
            autoFocus={false}
            className={
              // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
              cx(classes['content_settings_modal'], {
                [classes.open]: isOpen,
              })
            }
          >
            {children}
          </Paper>
        </div>,
        document.body
      )}
    </>
  );
};

export default ContentSettingsModal;
