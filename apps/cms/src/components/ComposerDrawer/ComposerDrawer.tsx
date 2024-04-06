import { Paper, CloseButton, Group, Text, Stack } from '@mantine/core';
import cx from 'clsx';
import classes from './ComposerDrawer.module.css';

interface ComposerDrawerProps {
  type: string;
  opened: boolean;
  close: () => void;
  children: React.ReactNode;
}

const ComposerDrawer = ({
  type,
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

      <Stack className={classes['composer_sidebar_drawer_content']}>
        {children}
      </Stack>
    </Paper>
  );
};

export default ComposerDrawer;
