import { Menu, Button, ThemeIcon } from '@mantine/core';
import { IconChevronDown, IconLetterCase } from '@tabler/icons-react';
import React from 'react';
import cx from 'clsx';
import classes from './ToolbarDropdown.module.css';

type DropDownItem = {
  text: string;
  onClick: () => void;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  icon?: React.FC<any>;
  activeFormat?: boolean;
};

interface ToolbarDropDownProps {
  type: 'block-format' | 'font-family' | 'font-size' | 'text-format';
  currentValue: string;
  ariaLabel: string;
  items: DropDownItem[];
  disabled: boolean;
}

const ToolbarDropdown = ({
  type,
  currentValue,
  ariaLabel,
  items,
  disabled = false,
}: ToolbarDropDownProps) => {
  // Determine which dropdown to render
  const switchDropdownOnType = () => {
    switch (type) {
      case 'font-size': {
        return (
          <Menu shadow='md' position='bottom-start' offset={5}>
            <Menu.Target>
              <Button
                disabled={disabled}
                aria-label={ariaLabel}
                className={classes['editor_toolbar_plain_button']}
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
                      cx(classes['editor_toolbar_dropdown_item_font_size'], {
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
      }
      case 'text-format': {
        return (
          <Menu shadow='md' position='bottom-start' offset={5}>
            <Menu.Target>
              <Button
                disabled={disabled}
                aria-label={ariaLabel}
                className={classes['editor_toolbar_plain_button']}
                leftSection={<IconLetterCase />}
                rightSection={<IconChevronDown />}
              ></Button>
            </Menu.Target>

            <Menu.Dropdown>
              {items.map((item) => {
                const Icon = item.icon!;
                return (
                  <Menu.Item
                    key={item.text}
                    leftSection={
                      <ThemeIcon variant='transparent'>
                        <Icon />
                      </ThemeIcon>
                    }
                    className={
                      // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
                      cx(classes['editor_toolbar_dropdown_item'], {
                        [classes.active]: item.activeFormat,
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
      }
      default: {
        return (
          <Menu shadow='md' position='bottom-start' offset={5}>
            <Menu.Target>
              <Button
                disabled={disabled}
                aria-label={ariaLabel}
                className={classes['editor_toolbar_plain_button']}
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
                      cx(classes['editor_toolbar_dropdown_item'], {
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
      }
    }
  };

  return <>{switchDropdownOnType()}</>;
};

export default ToolbarDropdown;
