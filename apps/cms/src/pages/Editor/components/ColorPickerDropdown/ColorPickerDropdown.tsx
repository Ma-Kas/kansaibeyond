import { IconTextColor, IconHighlight } from '@tabler/icons-react';
import { Menu, Button } from '@mantine/core';
import MantineColorPicker from '../ColorPicker/MantineColorPicker';
import classes from './ColorPickerDropdown.module.css';

interface ColorPickerDropdownProps {
  type: 'font-color' | 'bg-color';
  color: string;
  onChange: (value: string, skipHistoryStack: boolean) => void;
  ariaLabel: string;
  disabled?: boolean;
}

const ColorPickerDropdown = ({
  type,
  color,
  onChange,
  ariaLabel,
  disabled = false,
}: ColorPickerDropdownProps) => {
  const switchDropdownOnType = () => {
    switch (type) {
      case 'font-color': {
        return (
          <Menu shadow='md' position='bottom-start' offset={5}>
            <Menu.Target>
              <Button
                disabled={disabled}
                aria-label={ariaLabel}
                className={classes['editor_toolbar_plain_button']}
                leftSection={<IconTextColor />}
              ></Button>
            </Menu.Target>

            <Menu.Dropdown>
              <MantineColorPicker color={color} onChange={onChange} />
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
                leftSection={<IconHighlight />}
              ></Button>
            </Menu.Target>

            <Menu.Dropdown className={classes['editor_colorpick_dropdown']}>
              <MantineColorPicker color={color} onChange={onChange} />
            </Menu.Dropdown>
          </Menu>
        );
      }
    }
  };

  return <>{switchDropdownOnType()}</>;
};

export default ColorPickerDropdown;
