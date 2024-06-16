import parseInlineStyle from '@/utils/parse-inline-style-string';

import classes from './PostRoot.module.css';

type Props = {
  style?: string;
  children?: React.ReactNode;
};

const PostRoot = ({ style, children }: Props) => {
  return (
    <section
      className={classes['post_root']}
      {...(style && { style: parseInlineStyle(style) })}
    >
      {children}
    </section>
  );
};

export default PostRoot;
