import { getLanguageFriendlyName } from '@lexical/code';
import { Menu, Button, ThemeIcon } from '@mantine/core';
import {
  IconChevronDown,
  IconLetterCase,
  IconAlignLeft,
} from '@tabler/icons-react';
import React, { Fragment } from 'react';
import cx from 'clsx';
import classes from './ToolbarDropdown.module.css';

type DropDownItem = {
  text: string;
  onClick: () => void;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  icon?: React.FC<any>;
  codeValue?: string;
  activeFormat?: boolean;
};

interface ToolbarDropDownProps {
  type:
    | 'block-format'
    | 'font-family'
    | 'font-size'
    | 'code-language'
    | 'text-format'
    | 'element-format';
  currentValue: string;
  ariaLabel: string;
  items: DropDownItem[];
  disabled: boolean;
}

const matchAlignItemIcon = (currentValue: string, items: DropDownItem[]) => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].text === currentValue && items[i].icon !== undefined) {
      return items[i].icon;
    }
  }
  return null;
};

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
                type='button'
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
      case 'code-language': {
        return (
          <Menu shadow='md' position='bottom-start' offset={5}>
            <Menu.Target>
              <Button
                type='button'
                disabled={disabled}
                aria-label={ariaLabel}
                className={classes['editor_toolbar_plain_button']}
                rightSection={<IconChevronDown />}
              >
                {getLanguageFriendlyName(currentValue)}
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
                        [classes.active]: currentValue === item.codeValue,
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
                type='button'
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
      case 'element-format': {
        const currentIcon = matchAlignItemIcon(currentValue, items);
        const IconToDisplay = currentIcon ? currentIcon : IconAlignLeft;
        return (
          <Menu shadow='md' position='bottom-start' offset={5}>
            <Menu.Target>
              <Button
                type='button'
                disabled={disabled}
                aria-label={ariaLabel}
                className={classes['editor_toolbar_plain_button']}
                leftSection={
                  <ThemeIcon variant='transparent'>
                    <IconToDisplay />
                  </ThemeIcon>
                }
                rightSection={<IconChevronDown />}
              ></Button>
            </Menu.Target>

            <Menu.Dropdown>
              {items.map((item) => {
                const Icon = item.icon!;
                return (
                  <Fragment key={item.text}>
                    <Menu.Item
                      // key={item.text}
                      leftSection={
                        <ThemeIcon variant='transparent'>
                          <Icon />
                        </ThemeIcon>
                      }
                      className={
                        // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
                        cx(classes['editor_toolbar_dropdown_item'], {
                          [classes.active]: item.text === currentValue,
                        })
                      }
                      onClick={item.onClick}
                    >
                      {item.text}
                    </Menu.Item>
                    {item.text === 'Justify Align' && <Menu.Divider />}
                  </Fragment>
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
                type='button'
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
