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

const PostText = ({ format, style, text }: Props) => {
  const textFormats = getTextFormatStates(format);
  return (
    <>
      {constructTextComponentFromFormat(
        classes['post_text'],
        style,
        text,
        textFormats
      )}
    </>
  );
};

export default PostText;
