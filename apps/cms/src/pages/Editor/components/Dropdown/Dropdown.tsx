import { Menu, Button } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import cx from 'clsx';
import classes from './Dropdown.module.css';

type DropdownItem = {
  text: string;
  onClick: () => void;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  icon?: React.FC<any>;
  codeValue?: string;
  activeFormat?: boolean;
};

interface DropdownProps {
  type: 'general';
  currentValue: string;
  ariaLabel: string;
  items: DropdownItem[];
  disabled: boolean;
}

const Dropdown = ({
  currentValue,
  ariaLabel,
  items,
  disabled = false,
}: DropdownProps) => {
  return (
    <Menu shadow='md' position='bottom-start' offset={5}>
      <Menu.Target>
        <Button
          disabled={disabled}
          aria-label={ariaLabel}
          className={classes['editor_dropdown_plain_button']}
          rightSection={<IconChevronDown />}
        >
          {currentValue}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {items.map((item) => {
          return (
            <Menu.Item
              key={item.text}
              className={
                // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
                cx(classes['editor_dropdown_item_font_size'], {
                  [classes.active]: currentValue === item.text,
                })
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

export default Dropdown;
