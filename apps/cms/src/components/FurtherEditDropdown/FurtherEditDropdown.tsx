import { Menu, Button, ThemeIcon } from '@mantine/core';
import classes from './FurtherEditDropdown.module.css';

type DropdownItem = {
  text: string;
  onClick: () => void;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  icon?: React.FC<any>;
};

type Props = {
  items: DropdownItem[];
};

const FurtherEditDropdown = ({ items }: Props) => {
  return (
    <Menu shadow='md' position='left' offset={5} withArrow>
      <Menu.Target>
        <Button className={classes['further_edit_dropdown_button']}>
          &middot;&middot;&middot;
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {items.map((item) => {
          const Icon = item.icon!;
          return (
            <Menu.Item
              key={item.text}
              className={classes['further_edit_dropdown_item']}
              leftSection={
                <ThemeIcon variant='transparent'>
                  <Icon />
                </ThemeIcon>
              }
              onClick={item.onClick}
            >
              {item.text}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};

export default FurtherEditDropdown;
