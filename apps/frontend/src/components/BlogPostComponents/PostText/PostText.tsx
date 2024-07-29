import {
  getTextFormatStates,
  constructTextComponentFromFormat,
} from './postTextFormatHelpers';

import classes from './PostText.module.css';

type Props = {
  format: number;
  style: string;
  text: string;
};

// Object to return font-family variable for passed in font-family name
const fontFamilies: {
  [key: string]: string;
} = {
  'Futura Lt Light': 'var(--font-family-light)',
  'Futura Lt Book': 'var(--font-family-book)',
  Madefor: 'var(--font-family-madefor)',
  Geist: 'var(--font-family-geist-regular)',
  'Geist Light': 'var(--font-family-geist-light)',
  Lato: 'var(--font-family-lato-regular)',
  'Lato Light': 'var(--font-family-lato-light)',
  Roboto: 'var(--font-family-roboto-regular)',
  'Roboto Light': 'var(--font-family-roboto-light)',
} as const;

// CMS users can manually override font family, this parses text style and
// replaces font family in inline style with correct local css variable
const handleTextStyle = (style: string): string => {
  const index = style.search('font-family');
  if (index === -1) {
    return style;
  }
  const fontFamilyStyle = style.substring(index, style.indexOf(';', index));
  const fontFamily = fontFamilyStyle
    .slice(fontFamilyStyle.indexOf(':') + 1)
    .trim();

  return style.replace(
    fontFamilyStyle,
    `font-family: ${fontFamilies[fontFamily]}`
  );
};

const PostText = ({ format, style, text }: Props) => {
  const textFormats = getTextFormatStates(format);
  const textStyle = handleTextStyle(style);
  return (
    <>
      {constructTextComponentFromFormat(
        classes['post_text'],
        textStyle,
        text,
        textFormats
      )}
    </>
  );
};

export default PostText;
