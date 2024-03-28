import { Menu, Button } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import React from 'react';
import cx from 'clsx';
import classes from './ToolbarDropdown.module.css';

type DropDownItem = {
  text: string;
  onClick: () => void;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  icon?: React.FC<any>;
};

interface ToolbarDropDownProps {
  currentBlockType: string;
  ariaLabel: string;
  items: DropDownItem[];
  disabled: boolean;
}

const ToolbarDropdown = ({
  currentBlockType,
  ariaLabel,
  items,
  disabled = false,
}: ToolbarDropDownProps) => {
  return (
    <Menu shadow='md' width={200} position='bottom-start' offset={5}>
      <Menu.Target>
        <Button
          disabled={disabled}
          aria-label={ariaLabel}
          className={classes['editor_toolbar_plain_button']}
          rightSection={<IconChevronDown />}
        >
          {currentBlockType}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {items.map((item) => {
          return (
            <Menu.Item
              key={item.text}
              className={
                // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
                cx(classes['editor_toolbar_dropdown_item'], {
                  [classes.active]: currentBlockType === item.text,
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

export default ToolbarDropdown;
