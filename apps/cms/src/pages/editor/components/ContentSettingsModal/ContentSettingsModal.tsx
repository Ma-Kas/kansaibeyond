import { CloseButton, Text, Group, Paper, Stack } from '@mantine/core';
import cx from 'clsx';
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import classes from './ContentSettingsModal.module.css';

interface ModalProps {
  title: string;
  isOpen: boolean;
  close: () => void;
  children: ReactNode;
}

const ContentSettingsModal = ({
  title,
  isOpen,
  close,
  children,
}: ModalProps) => {
  // Close on Escape key
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [close]);

  // Close on click outside modal
  const handleOutsideClick = (e: React.MouseEvent) => {
    const target = e.target;
    const className = classes['content_settings_modal_container'];
    if (
      !target ||
      !(target instanceof HTMLElement) ||
      !target.classList.contains(className)
    ) {
      return;
    }
    close();
  };

  return (
    <>
      {createPortal(
        <div
          className={classes['content_settings_modal_container']}
          onClick={handleOutsideClick}
        >
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
            <Group
              className={classes['content_settings_modal_header']}
              justify='space-between'
            >
              <Text>{title}</Text>
              <CloseButton
                className={classes['content_settings_modal_close_button']}
                onClick={close}
              />
            </Group>
            <Stack className={classes['content_settings_modal_content']}>
              {children}
            </Stack>
          </Paper>
        </div>,
        document.body
      )}
    </>
  );
};

export default ContentSettingsModal;
