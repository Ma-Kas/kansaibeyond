import parseInlineStyle from '../../../utils/parse-inline-style-string';

type Props = {
  className: string;
  style?: string;
  url: string;
  children?: React.ReactNode;
};

const PostLink = ({ className, style, url, children }: Props) => {
  return (
    <a
      className={className}
      href={url}
      {...(style && { style: parseInlineStyle(style) })}
    >
      {children}
    </a>
  );
};

export default PostLink;
