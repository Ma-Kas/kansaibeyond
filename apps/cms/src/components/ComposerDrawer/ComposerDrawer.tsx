import {
  Paper,
  CloseButton,
  Group,
  Text,
  Stack,
  ScrollArea,
} from '@mantine/core';
import cx from 'clsx';
import classes from './ComposerDrawer.module.css';

interface ComposerDrawerProps {
  type: string;
  description?: string;
  opened: boolean;
  close: () => void;
  children: React.ReactNode;
}

const ComposerDrawer = ({
  type,
  description,
  opened,
  close,
  children,
}: ComposerDrawerProps) => {
  return (
    <Paper
      radius={0}
      className={
        // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
        cx(classes['composer_sidebar_drawer'], {
          [classes.open]: opened,
        })
      }
    >
      <Group
        className={classes['composer_sidebar_drawer_header']}
        justify='space-between'
      >
        <Text>{type}</Text>
        <CloseButton
          className={classes['composer_sidebar_drawer_close_button']}
          onClick={close}
        />
      </Group>
      {description && (
        <div className={classes['sidebar_drawer_description']}>
          {description}
        </div>
      )}

      <ScrollArea
        classNames={{
          root: classes['scrollarea_root'],
          thumb: classes['scrollbar_thumb'],
          viewport: classes['scrollarea_viewport'],
        }}
        scrollbars='y'
        scrollbarSize={'0.5rem'}
      >
        <Stack className={classes['composer_sidebar_drawer_content']}>
          {children}
        </Stack>
      </ScrollArea>
    </Paper>
  );
};

export default ComposerDrawer;
