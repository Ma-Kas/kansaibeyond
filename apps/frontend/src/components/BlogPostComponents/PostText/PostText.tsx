import {
  getTextFormatStates,
  handleTextStyle,
  constructTextComponentFromFormat,
} from '@/utils/post-text-style-helpers';

import classes from './PostText.module.css';

type Props = {
  format: number;
  style: string;
  text: string;
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
