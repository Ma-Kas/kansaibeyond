import { ElementFormatType } from 'lexical';

export const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Paragraph',
  quote: 'Quote',
};

export const FONT_FAMILY_OPTIONS: [string, string][] = [
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Georgia', 'Georgia'],
  ['Times New Roman', 'Times New Roman'],
  ['Trebuchet MS', 'Trebuchet MS'],
  ['Verdana', 'Verdana'],
];

export const FONT_SIZE_OPTIONS: [string, string][] = [
  ['6px', '6px'],
  ['8px', '8px'],
  ['10px', '10px'],
  ['12px', '12px'],
  ['14px', '14px'],
  ['16px', '16px'],
  ['18px', '18px'],
  ['20px', '20px'],
  ['22px', '22px'],
  ['24px', '24px'],
  ['28px', '28px'],
  ['30px', '30px'],
  ['36px', '36px'],
  ['40px', '40px'],
  ['48px', '48px'],
  ['64px', '64px'],
  ['72px', '72px'],
  ['96px', '96px'],
];

export const ELEMENT_FORMAT_OPTIONS: {
  [key in Exclude<ElementFormatType, ''>]: {
    icon: string;
    iconRTL: string;
    name: string;
  };
} = {
  center: {
    icon: 'center-align',
    iconRTL: 'center-align',
    name: 'Center Align',
  },
  end: {
    icon: 'right-align',
    iconRTL: 'left-align',
    name: 'End Align',
  },
  justify: {
    icon: 'justify-align',
    iconRTL: 'justify-align',
    name: 'Justify Align',
  },
  left: {
    icon: 'left-align',
    iconRTL: 'left-align',
    name: 'Left Align',
  },
  right: {
    icon: 'right-align',
    iconRTL: 'right-align',
    name: 'Right Align',
  },
  start: {
    icon: 'left-align',
    iconRTL: 'right-align',
    name: 'Start Align',
  },
};

export const COLOR_SWATCHES = [
  '#d0021b',
  '#f5a623',
  '#f8e71c',
  '#8b572a',
  '#7ed321',
  '#417505',
  '#bd10e0',
  '#9013fe',
  '#4a90e2',
  '#50e3c2',
  '#b8e986',
  '#000000',
  '#4a4a4a',
  '#9b9b9b',
];

export const ASPECT_RATIO_DATA = [
  {
    label: '16:9',
    value: '16 / 9',
  },
  {
    label: '4:3',
    value: '4 / 3',
  },
  {
    label: '5:4',
    value: '5 / 4',
  },
  {
    label: '1.91:1',
    value: '1.91 / 1',
  },
  {
    label: '1:1',
    value: '1 / 1',
  },
  {
    label: '3:4',
    value: '3 / 4',
  },
  {
    label: '4:5',
    value: '4 / 5',
  },
  {
    label: '9:16',
    value: '9 / 16',
  },
];
