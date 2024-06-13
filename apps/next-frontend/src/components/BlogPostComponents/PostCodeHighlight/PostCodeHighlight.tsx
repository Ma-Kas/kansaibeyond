import {
  getCodeHighlightFormatStates,
  constructCodeHighlightComponentFromFormat,
} from './postCodeHighlightFormatHelpers';

import classes from './PostCodeHighlight.module.css';

type Props = {
  format: number;
  style: string;
  text: string;
};

const PostCodeHighlight = ({ format, style, text }: Props) => {
  const textFormats = getCodeHighlightFormatStates(format);
  return (
    <>
      {constructCodeHighlightComponentFromFormat(
        classes['post_code_highlight'],
        style,
        text,
        textFormats
      )}
    </>
  );
};

export default PostCodeHighlight;
