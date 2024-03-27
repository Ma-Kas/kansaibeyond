import { UnstyledButton, rem } from '@mantine/core';
import classes from './ComposerSidebarButton.module.css';

interface Props {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  icon: React.FC<any>;
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const ComposerSidebarButton = ({ icon: Icon, text, onClick }: Props) => {
  return (
    <UnstyledButton onClick={onClick} className={classes['button_root']}>
      <span className={classes['icon_container']}>
        <Icon style={{ width: rem(24), height: rem(24) }} />
      </span>
      <span className={classes['button_label']}>{text}</span>
    </UnstyledButton>
  );
};

export default ComposerSidebarButton;
