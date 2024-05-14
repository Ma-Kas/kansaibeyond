import parseInlineStyle from '../../../utils/parse-inline-style-string';

import classes from './PostHorizontalRule.module.css';

type Props = {
  style?: string;
};

const PostHorizontalRule = ({ style }: Props) => {
  return (
    <hr
      className={classes['post_horizontal_rule']}
      {...(style && { style: parseInlineStyle(style) })}
    ></hr>
  );
};

export default PostHorizontalRule;
