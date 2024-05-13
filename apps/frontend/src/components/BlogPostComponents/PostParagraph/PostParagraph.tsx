import parseInlineStyle from '../../../utils/parse-inline-style-string';

type Props = {
  className: string;
  style?: string;
  children?: React.ReactNode;
};

const PostParagraph = ({ className, style, children }: Props) => {
  return (
    <p className={className} {...(style && { style: parseInlineStyle(style) })}>
      {children}
    </p>
  );
};

export default PostParagraph;
