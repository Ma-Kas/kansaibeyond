import parseInlineStyle from '../../../utils/parse-inline-style-string';

import classes from './PostImageBlock.module.css';

type Props = {
  style?: string;
  children?: React.ReactNode;
};

const PostImageBlock = ({ style, children }: Props) => {
  return (
    <div
      className={classes['post_image_block']}
      {...(style && { style: parseInlineStyle(style) })}
    >
      {children}
    </div>
  );
};

export default PostImageBlock;
