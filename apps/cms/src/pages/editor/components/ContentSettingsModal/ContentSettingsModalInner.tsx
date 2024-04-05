import { CloseButton, Text, Group, Stack, Button } from '@mantine/core';

import classes from './ContentSettingsModal.module.css';
import { ReactNode, useEffect } from 'react';

interface ModalProps {
  title: string;
  cancel: () => void;
  confirm: () => void;
  children: ReactNode;
}

const ContentSettingsModalInner = ({
  title,
  cancel,
  confirm,
  children,
}: ModalProps) => {
  // Close on Escape key or outsideClick
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancel();
      }
    };

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target;
      const className = classes['content_settings_modal_container'];
      if (
        target &&
        target instanceof HTMLElement &&
        target.classList.contains(className)
      ) {
        cancel();
      }
    };

    window.addEventListener('keydown', handleEscape);
    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [cancel]);

  const switchRenderOnTitle = () => {
    switch (title) {
      case 'Gallery Settings': {
        return (
          <>
            <Group
              className={classes['content_settings_modal_header']}
              justify='space-between'
            >
              <Text>{title}</Text>
              <CloseButton
                className={classes['content_settings_modal_close_button']}
                onClick={cancel}
              />
            </Group>
            {children}
            <Group className={classes['content_settings_modal_footer']}>
              <Button
                className={classes['content_settings_modal_cancel_button']}
                onClick={cancel}
              >
                Cancel
              </Button>
              <Button
                className={classes['content_settings_modal_confirm_button']}
                onClick={confirm}
              >
                Confirm
              </Button>
            </Group>
          </>
        );
      }
      case 'Carousel Settings': {
        return (
          <>
            <Group
              className={classes['content_settings_modal_header']}
              justify='space-between'
            >
              <Text>{title}</Text>
              <CloseButton
                className={classes['content_settings_modal_close_button']}
                onClick={cancel}
              />
            </Group>
            {children}
            <Group className={classes['content_settings_modal_footer']}>
              <Button
                className={classes['content_settings_modal_cancel_button']}
                onClick={cancel}
              >
                Cancel
              </Button>
              <Button
                className={classes['content_settings_modal_confirm_button']}
                onClick={confirm}
              >
                Confirm
              </Button>
            </Group>
          </>
        );
      }
      default: {
        return (
          <>
            <Group
              className={classes['content_settings_modal_header']}
              justify='space-between'
            >
              <Text>{title}</Text>
              <CloseButton
                className={classes['content_settings_modal_close_button']}
                onClick={cancel}
              />
            </Group>
            <div className={classes['content_settings_modal_content']}>
              <Stack
                className={classes['content_settings_modal_content_inner']}
              >
                {children}
              </Stack>
            </div>
            <Group className={classes['content_settings_modal_footer']}>
              <Button
                className={classes['content_settings_modal_cancel_button']}
                onClick={cancel}
              >
                Cancel
              </Button>
              <Button
                className={classes['content_settings_modal_confirm_button']}
                onClick={confirm}
              >
                Confirm
              </Button>
            </Group>
          </>
        );
      }
    }
  };

  return <>{switchRenderOnTitle()}</>;
};

export default ContentSettingsModalInner;
