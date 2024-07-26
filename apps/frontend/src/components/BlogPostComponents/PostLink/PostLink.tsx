import parseInlineStyle from '@/utils/parse-inline-style-string';

import classes from './PostLink.module.css';

type Props = {
  style?: string;
  url: string;
  children?: React.ReactNode;
};

const PostLink = ({ style, url, children }: Props) => {
  return (
    <a
      className={classes['post_link']}
      href={url}
      {...(style && { style: parseInlineStyle(style) })}
    >
      {children}
    </a>
  );
};

export default PostLink;
