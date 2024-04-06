import { UnstyledButton, rem } from '@mantine/core';
import cx from 'clsx';
import classes from './ComposerSidebarButton.module.css';

interface Props {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  icon: React.FC<any>;
  text: string;
  drawerOpen: boolean;
  currentDrawer: string | null;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const ComposerSidebarButton = ({
  icon: Icon,
  text,
  drawerOpen,
  currentDrawer,
  onClick,
}: Props) => {
  return (
    <UnstyledButton
      onClick={onClick}
      className={
        // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
        cx(classes['button_root'], {
          [classes.active]: drawerOpen && currentDrawer === text,
        })
      }
    >
      <span className={classes['icon_container']}>
        <Icon style={{ width: rem(24), height: rem(24) }} />
      </span>
      <span className={classes['button_label']}>{text}</span>
    </UnstyledButton>
  );
};

export default ComposerSidebarButton;
