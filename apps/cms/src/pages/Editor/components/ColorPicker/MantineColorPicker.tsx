import { ColorPicker, TextInput } from '@mantine/core';
import { COLOR_SWATCHES } from '../../../../utils/editor-constants';
import { useEffect, useState } from 'react';
import classes from './MantineColorPicker.module.css';

interface ColorPickerProps {
  color: string;
  onChange: (value: string, skipHistoryStack: boolean) => void;
}

let skipAddingToHistoryStack = false;

const MantineColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const [currentColor, setCurrentColor] = useState(color);
  const [input, setInput] = useState(color);

  useEffect(() => {
    onChange(currentColor, skipAddingToHistoryStack);
  }, [currentColor, onChange]);

  const handleColorPick = (color: string) => {
    setCurrentColor(color);
    setInput(color);
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newValue = e.target.value;
    const hexaRegex = /^#(?:(?:[A-F0-9]{2}){3,4}|[A-F0-9]{3})$/i;
    if (hexaRegex.test(newValue)) {
      setCurrentColor(newValue);
    }
    setInput(newValue);
  };

  // Handle history stack of editor
  // Only add new color to undo history on mouseup, to avoid every color on
  // mousemove to be added to history
  const onMouseDown = (e: React.MouseEvent): void => {
    if (e.button !== 0) {
      return;
    }

    const onMouseMove = (_e: MouseEvent): void => {
      skipAddingToHistoryStack = true;
    };

    const onMouseUp = (_e: MouseEvent): void => {
      skipAddingToHistoryStack = false;

      document.removeEventListener('mousemove', onMouseMove, false);
      document.removeEventListener('mouseup', onMouseUp, false);
    };

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
  };

  return (
    <>
      <TextInput
        key='hex-input'
        className={classes['editor_colorpick_input_field']}
        leftSection={'Hexa-Code:'}
        aria-label='Hex color code input'
        value={input}
        onChange={handleTextInput}
        autoFocus
      />
      <ColorPicker
        format='hexa'
        value={currentColor}
        onChange={handleColorPick}
        swatches={COLOR_SWATCHES}
        onMouseDown={onMouseDown}
        className={classes['editor_colorpick_main']}
        alphaLabel='Alpha slider for color picker.'
        hueLabel='Hue slider for color picker.'
        saturationLabel='Saturation slider for color picker.'
        fullWidth
      />
    </>
  );
};

export default MantineColorPicker;
