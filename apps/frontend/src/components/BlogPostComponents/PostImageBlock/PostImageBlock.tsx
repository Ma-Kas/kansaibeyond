import parseInlineStyle from '../../../utils/parse-inline-style-string';

type Props = {
  className: string;
  style?: string;
  children?: React.ReactNode;
};

const PostImageBlock = ({ className, style, children }: Props) => {
  return (
    <div
      className={className}
      {...(style && { style: parseInlineStyle(style) })}
    >
      {children}
    </div>
  );
};

export default PostImageBlock;
