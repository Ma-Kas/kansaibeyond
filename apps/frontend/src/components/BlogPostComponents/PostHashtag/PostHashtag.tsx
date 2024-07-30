import {
  getTextFormatStates,
  handleTextStyle,
  constructTextComponentFromFormat,
} from '@/utils/post-text-style-helpers';

import classes from './PostHashtag.module.css';

type Props = {
  format: number;
  style: string;
  text: string;
};

const PostHashtag = ({ format, style, text }: Props) => {
  const textFormats = getTextFormatStates(format);
  const textStyle = handleTextStyle(style);
  return (
    <>
      {constructTextComponentFromFormat(
        classes['post_hashtag'],
        textStyle,
        text,
        textFormats
      )}
    </>
  );
};

export default PostHashtag;
