import parseInlineStyle from '../../../utils/parse-inline-style-string';

type Props = {
  className: string;
  style?: string;
  text: string;
};

const PostText = ({ className, style, text }: Props) => {
  return (
    <span
      className={className}
      {...(style && { style: parseInlineStyle(style) })}
    >
      {text}
    </span>
  );
};

export default PostText;
